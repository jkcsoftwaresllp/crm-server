import * as logger from './src/common/logger/loggerSetup.js';

async function testEnhancedLogger() {
  console.log('🚀 Testing Enhanced CRM Logger with Rich Context Display...\n');

  await logger.info('CRM system starting', { component: 'startup', version: '0.0.1' });
  await logger.debug('Debug information with rich context', {});
  await logger.warn('Warning with detailed context', {});
  await logger.error('Error with comprehensive context', {});

  await logger.warn('Invalid login attempt detected', {
    component: 'auth',
    username: 'unknown_user',
    ip: '192.168.1.45',
    method: 'POST /login',
    reason: 'Invalid password',
    attemptCount: 5,
    lockoutThreshold: 5,
  });

  await logger.error('Missing required environment variable', {
    component: 'config',
    variable: 'JWT_SECRET',
    expectedType: 'string',
    fallbackUsed: false,
  });

  await logger.warn('Validation failed for incoming request', {
    component: 'api',
    endpoint: '/users',
    method: 'POST',
    invalidFields: ['email', 'password'],
    expectedFormat: {
      email: 'valid email',
      password: '8+ chars with number/symbol',
    },
    receivedPayload: {
      email: 'notanemail',
      password: 'short',
    },
  });

  await logger.error('Email service timeout', {
    component: 'email-service',
    provider: 'SendGrid',
    timeoutThreshold: '5s',
    actualTime: '8.1s',
    retryAttempt: 2,
  });

  await logger.info('Bulk user creation initiated', {
    component: 'user-admin',
    createdBy: 'admin_123',
    organizationId: 'org_456',
    totalUsers: 250,
    source: 'CSV Upload',
  });

  await logger.warn('Some users failed during batch creation', {
    component: 'user-admin',
    failedCount: 12,
    errorSamples: [
      { line: 12, email: 'bademail@', reason: 'invalid email' },
      { line: 34, email: 'dup@email.com', reason: 'duplicate' },
    ],
  });

  try {
    throw new Error('Unexpected runtime exception in billing module');
  } catch (err) {
    await logger.error('Fatal application error caught', {
      component: 'billing-service',
      error: err,
      stack: err.stack,
      requestId: 'req_fatal_001',
    });
  }

  console.log('\n=== Simulate Extra Slow Query (1000ms) ===');
  const longQuery = () => new Promise((res) => setTimeout(() => res([]), 1000));
  const start = logger.startTimer();
  await longQuery();
  const duration = logger.endTimer(start);

  await logger.logSlowQuery('SELECT * FROM invoices WHERE status = "unpaid"', duration, {
    component: 'billing-service',
    queryType: 'long-running-report',
    status: 'unpaid',
    limit: 1000,
    filters: ['date range', 'status'],
    durationCategory: duration > 1000 ? 'critical' : 'warning',
  });

  console.log('\n✅ All test cases for enhanced logger executed!');
  console.log('📁 Check logs/ directory or your console depending on NODE_ENV');
}

testEnhancedLogger().catch(console.error);
