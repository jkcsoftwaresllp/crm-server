import * as logger from '../logger/loggerSetup.js';

export function requestLogger(req, res, next) {
  const startTime = logger.startTimer();
  const requestId = `req_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  
  // Enhanced request context with detailed information
  const requestContext = {
    requestId,
    method: req.method,
    url: req.url,
    originalUrl: req.originalUrl,
    ip: req.ip,
    userAgent: req.get('User-Agent'),
    contentType: req.get('Content-Type'),
    contentLength: req.get('Content-Length'),
    referer: req.get('Referer'),
    origin: req.get('Origin'),
    acceptLanguage: req.get('Accept-Language'),
    acceptEncoding: req.get('Accept-Encoding'),
    host: req.get('Host'),
    protocol: req.protocol,
    secure: req.secure,
    query: Object.keys(req.query).length > 0 ? req.query : undefined,
    params: Object.keys(req.params).length > 0 ? req.params : undefined
  };
  
  req.requestId = requestId;
  req.logger = {
    error: (message, context = {}) => logger.error(message, { 
      requestId, 
      request: requestContext,
      component: context.component || 'request-context',
      ...context 
    }),
    warn: (message, context = {}) => logger.warn(message, { 
      requestId, 
      request: requestContext,
      component: context.component || 'request-context',
      ...context 
    }),
    info: (message, context = {}) => logger.info(message, { 
      requestId, 
      request: requestContext,
      component: context.component || 'request-context',
      ...context 
    }),
    debug: (message, context = {}) => logger.debug(message, { 
      requestId, 
      request: requestContext,
      component: context.component || 'request-context',
      ...context 
    })
  };

  logger.info('Request started', {
    ...requestContext,
    component: 'request-handler',
    flow: 'incoming',
    timestamp: new Date().toISOString()
  });

  res.on('finish', () => {
    const duration = logger.endTimer(startTime);
    
    // Enhanced response context
    const responseContext = {
      ...requestContext,
      response: {
        statusCode: res.statusCode,
        statusMessage: res.statusMessage,
        contentType: res.get('Content-Type'),
        contentLength: res.get('Content-Length'),
        duration: `${duration}ms`,
        durationMs: duration
      },
      performance: {
        responseTime: duration,
        isSlowRequest: duration > 1000,
        performanceCategory: duration < 100 ? 'fast' : duration < 500 ? 'normal' : duration < 1000 ? 'slow' : 'very-slow'
      },
      component: 'request-handler',
      flow: 'completed',
      timestamp: new Date().toISOString()
    };
    
    if (duration > 1000) {
      logger.warn('Slow request detected', responseContext);
    } else {
      logger.info('Request completed', responseContext);
    }
  });

  next();
}
