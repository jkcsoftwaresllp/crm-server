import fs from 'fs/promises';
import path from 'path';
import os from 'os';

const levels = { error: 0, warn: 1, info: 2, debug: 3 };
const colors = {
  error: '\x1b[31m', warn: '\x1b[33m', info: '\x1b[36m',
  debug: '\x1b[35m', reset: '\x1b[0m'
};

const currentLevel = process.env.NODE_ENV === 'production' ? 'info' : 'debug';
const logDir = path.join(process.cwd(), 'logs');
const maxFileSize = 10 * 1024 * 1024; // 10MB
const maxFiles = 5;
const slowQueryThreshold = 500; // ms

async function initLogDir() {
  try { await fs.access(logDir); }
  catch { await fs.mkdir(logDir, { recursive: true }); }
}
initLogDir();

function shouldLog(level) {
  return levels[level] <= levels[currentLevel];
}

function formatMessage(level, message, context = {}) {
  return {
    timestamp: new Date().toISOString(),
    level: level.toUpperCase(),
    message,
    hostname: os.hostname(),
    pid: process.pid,
    service: 'crm-backend',
    database: 'crm',
    environment: process.env.NODE_ENV || 'development',
    ...context
  };
}

async function rotateFile(filePath) {
  try {
    const stats = await fs.stat(filePath);
    if (stats.size >= maxFileSize) {
      for (let i = maxFiles - 1; i >= 1; i--) {
        const oldFile = `${filePath}.${i}`;
        const newFile = `${filePath}.${i + 1}`;
        try {
          await fs.access(oldFile);
          if (i === maxFiles - 1) await fs.unlink(oldFile);
          else await fs.rename(oldFile, newFile);
        } catch {}
      }
      await fs.rename(filePath, `${filePath}.1`);
    }
  } catch {}
}

async function writeToFile(level, logEntry) {
  const fileName = level === 'error' ? 'error.log' : 'app.log';
  const filePath = path.join(logDir, fileName);
  await rotateFile(filePath);
  await fs.appendFile(filePath, JSON.stringify(logEntry) + '\n');
}

function logToConsole(level, logEntry) {
  const color = colors[level] || '';
  const reset = colors.reset;
  const time = new Date(logEntry.timestamp).toLocaleTimeString();
  
  // Display main message
  console.log(`${color}[${time}] ${level.toUpperCase()}:${reset} ${logEntry.message}`);
  
  // Display context object if present and not empty (excluding standard fields)
  if (logEntry && Object.keys(logEntry).length > 0) {
    const { timestamp, level: logLevel, message, hostname, pid, service, database, environment, ...context } = logEntry;
    if (Object.keys(context).length > 0) {
      console.log(`${color}Context:${reset}`);
      console.log(JSON.stringify(context, null, 2));
    }
  }
}

async function log(level, message, context = {}) {
  if (!shouldLog(level)) return;
  const logEntry = formatMessage(level, message, context);
  
  if (process.env.NODE_ENV !== 'production') logToConsole(level, logEntry);
  if (process.env.NODE_ENV === 'production') await writeToFile(level, logEntry);
}

export async function error(message, context = {}) {
  if (context.error?.stack) {
    context.stack = context.error.stack;
    context.errorName = context.error.name;
    context.errorMessage = context.error.message;
  }
  await log('error', message, context);
}

export async function warn(message, context = {}) { 
  await log('warn', message, context); 
}

export async function info(message, context = {}) { 
  await log('info', message, context); 
}

export async function debug(message, context = {}) { 
  await log('debug', message, context); 
}

export async function logSlowQuery(query, duration, context = {}) {
  if (duration >= slowQueryThreshold) {
    await warn('Slow query detected', {
      query: query.substring(0, 200) + (query.length > 200 ? '...' : ''),
      duration: `${duration}ms`,
      durationMs: duration,
      threshold: `${slowQueryThreshold}ms`,
      table: extractTable(query),
      queryType: query.trim().split(' ')[0].toUpperCase(),
      performanceIssue: true,
      ...context
    });
  }
}

export function extractTable(sql) {
  const match = sql.match(/(?:FROM|INTO|UPDATE|JOIN)\s+`?(\w+)`?/i);
  return match ? match[1] : 'unknown';
}

export function startTimer() { return process.hrtime.bigint(); }
export function endTimer(startTime) {
  return Number(process.hrtime.bigint() - startTime) / 1000000;
}
