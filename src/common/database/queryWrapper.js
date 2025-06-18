import pool from '../configs/db.js';
import * as logger from '../logger/loggerSetup.js';

export async function executeQuery(sql, params = [], context = {}) {
  const startTime = logger.startTimer();
  const queryId = `qry_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  
  // Enhanced query context
  const queryContext = {
    queryId,
    sql: sql.substring(0, 150) + (sql.length > 150 ? '...' : ''),
    fullSqlLength: sql.length,
    params: params.length,
    paramValues: params.length <= 5 ? params : `${params.length} parameters`,
    table: logger.extractTable(sql),
    operation: sql.trim().split(' ')[0].toUpperCase(),
    component: 'database',
    timestamp: new Date().toISOString(),
    ...context
  };
  
  try {
    logger.debug('Executing database query', queryContext);
    
    const [rows] = await pool.execute(sql, params);
    const duration = logger.endTimer(startTime);
    
    // Enhanced success context
    const successContext = {
      ...queryContext,
      result: {
        rowCount: Array.isArray(rows) ? rows.length : 1,
        duration: `${duration}ms`,
        durationMs: duration,
        success: true,
        hasResults: Array.isArray(rows) ? rows.length > 0 : true
      },
      performance: {
        executionTime: duration,
        isOptimal: duration < 100,
        needsOptimization: duration > 500,
        performanceCategory: duration < 50 ? 'excellent' : duration < 100 ? 'good' : duration < 500 ? 'acceptable' : 'slow'
      }
    };
    
    await logger.logSlowQuery(sql, duration, successContext);
    
    if (duration < 500) {
      logger.debug('Query executed successfully', successContext);
    }
    
    return rows;
  } catch (error) {
    const duration = logger.endTimer(startTime);
    
    // Enhanced error context
    const errorContext = {
      ...queryContext,
      error: {
        message: error.message,
        code: error.code,
        errno: error.errno,
        sqlState: error.sqlState,
        sqlMessage: error.sqlMessage,
        duration: `${duration}ms`,
        durationMs: duration,
        failed: true
      },
      troubleshooting: {
        queryType: sql.trim().split(' ')[0].toUpperCase(),
        suggestedAction: 'Check query syntax and database connection',
        errorCategory: error.code ? 'database-error' : 'connection-error'
      }
    };
    
    await logger.error('Database query failed', { error, ...errorContext });
    throw error;
  }
}

// Enhanced CRM-specific helpers
export async function getUserById(userId, context = {}) {
  return executeQuery(
    'SELECT * FROM users WHERE id = ? AND is_active = 1',
    [userId],
    { 
      operation: 'get-user', 
      userId, 
      businessContext: 'user-lookup',
      crmEntity: 'user',
      ...context 
    }
  );
}

export async function logActivity(userId, action, resourceType, resourceId, oldValues, newValues, context = {}) {
  return executeQuery(
    'INSERT INTO activity_logs (user_id, organization_id, action, resource_type, resource_id, old_values, new_values, ip_address, user_agent) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
    [userId, context.organizationId, action, resourceType, resourceId, JSON.stringify(oldValues), JSON.stringify(newValues), context.ip_address, context.user_agent],
    { 
      operation: 'log-activity', 
      userId, 
      action,
      businessContext: 'audit-trail',
      crmEntity: 'activity_log',
      auditInfo: {
        resourceType,
        resourceId,
        changeType: action,
        hasChanges: Object.keys(newValues || {}).length > 0,
        changeCount: Object.keys(newValues || {}).length
      },
      ...context 
    }
  );
}
