import os from 'os';
import { performance } from 'perf_hooks';
import { exec } from 'child_process';
import util from 'util';
import mysql from 'mysql2/promise';

const execAsync = util.promisify(exec);

export async function healthCheck(startTime = performance.now()) {
  // 1. Database Check (MySQL)
  let dbStatus = 'down';
  try {
    const conn = await mysql.createConnection(dbConfig);
    await conn.query('SELECT 1');
    await conn.end();
    dbStatus = 'up';
  } catch (err) {
    dbStatus = 'down';
  }

  // 2. Memory Usage
  const memoryUsage = process.memoryUsage();
  const memory = {
    rss: `${(memoryUsage.rss / 1024 / 1024).toFixed(2)} MB`,
    heapUsed: `${(memoryUsage.heapUsed / 1024 / 1024).toFixed(2)} MB`,
    heapTotal: `${(memoryUsage.heapTotal / 1024 / 1024).toFixed(2)} MB`,
  };

  // 3. Disk Space
  let disk = {};
  try {
    const { stdout } = await execAsync('df -h /');
    const lines = stdout.trim().split('\n');
    const diskInfo = lines[1].split(/\s+/);
    disk = {
      size: diskInfo[1],
      used: diskInfo[2],
      available: diskInfo[3],
      usage: diskInfo[4],
    };
  } catch {
    disk = { error: 'Disk check failed' };
  }

  // 4. Response Time
  const responseTimeMs = (performance.now() - startTime).toFixed(2);

  // 5. Standardized Output
  return {
    success: dbStatus === 'up',
    status: dbStatus === 'up' ? 200 : 500,
    message: dbStatus === 'up' ? 'Healthy' : 'Database unavailable',
    timestamp: new Date().toISOString(),
    data: {
      database: dbStatus,
      memory,
      disk,
      responseTimeMs: `${responseTimeMs} ms`,
    },
  };
}
