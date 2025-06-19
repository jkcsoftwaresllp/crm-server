import * as logger from '../src/common/logger/loggerSetup.js';

async function testLogger() {
  console.log('🚀 Testing CRM Logger with Verbose Level...\n');
  
  // Test all log levels including verbose
  await logger.error('Error message', { component: 'test', userId: 123 });
  await logger.warn('Warning message', { component: 'test', issue: 'slow_connection' });
  await logger.info('Info message', { component: 'test', action: 'startup' });
  await logger.verbose('Verbose message', { component: 'test', details: 'detailed_info' });
  await logger.debug('Debug message', { component: 'test', debugLevel: 'high' });
  
  // Test slow query detection
  console.log('\n=== Testing Slow Query Detection ===');
  const slowQuery = () => new Promise(resolve => setTimeout(() => resolve([]), 600));
  const startTime = logger.startTimer();
  await slowQuery();
  const duration = logger.endTimer(startTime);
  
  await logger.logSlowQuery(
    'SELECT * FROM users WHERE organization_id = ? AND is_active = 1', 
    duration, 
    { component: 'test' }
  );
  
  console.log('\n✅ Logger tests completed');
  console.log('📁 Check logs/ directory for production files');
}

testLogger().catch(console.error);
