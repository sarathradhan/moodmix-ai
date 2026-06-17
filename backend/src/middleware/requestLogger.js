import logger from '../utils/logger.js';

/** Logs incoming HTTP requests */
export function requestLogger(req, _res, next) {
  logger.info(`${req.method} ${req.path}`);
  next();
}
