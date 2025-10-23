/**
 * Logger utility that only logs in development mode
 * Prevents sensitive information from being exposed in production console
 */

const isDevelopment = import.meta.env.DEV;

export const logger = {
  debug: (...args: any[]) => {
    if (isDevelopment) console.log('[DEBUG]', ...args);
  },
  error: (...args: any[]) => {
    if (isDevelopment) console.error('[ERROR]', ...args);
    // In production, this could send to an error tracking service like Sentry
  },
  warn: (...args: any[]) => {
    if (isDevelopment) console.warn('[WARN]', ...args);
  },
  info: (...args: any[]) => {
    if (isDevelopment) console.info('[INFO]', ...args);
  }
};
