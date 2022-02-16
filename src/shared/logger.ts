import pino from 'pino';
import { IS_TEST_ENV } from './constants';

const loggingTool = pino({
  enabled: process.env.NODE_ENV !== 'production' && !IS_TEST_ENV,
  browser: { asObject: true },
});

export const logger = {
  info: loggingTool.info,
  warn: loggingTool.warn,
  debug: loggingTool.debug,
  error: loggingTool.error,
};
