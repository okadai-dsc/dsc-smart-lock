import config from 'config';
import * as Log4js from 'log4js';

/**
 * Logger
 */
export class Logger {
  /**
   * Loggerの初期化
   */
  public static initialize() {
    let level = 'info';
    if (config.get('debug') || process.env.NODE === 'dev') {
      level = 'all';
    }
    Log4js.configure({
      appenders: {
        bot: {
          type: 'dateFile',
          filename: './logs/bot',
          pattern: 'yyyyMMdd.log',
          alwaysIncludePattern: 'true',
        },
        console: {
          type: 'console',
        },
      },
      categories: {
        default: { appenders: ['bot', 'console'], level: level },
      },
    });
    this.debug('🪲 Debug Info: Show');
  }

  /**
   * traceレベルのログを出力する
   *
   * @param {string} message
   */
  public static trace(message: string) {
    const logger = Log4js.getLogger('bot');
    logger.trace(message);
  }

  /**
   * debugレベルのログを出力する
   *
   * @param {string} message
   */
  public static debug(message: string) {
    const logger = Log4js.getLogger('bot');
    logger.debug(message);
  }

  /**
   * infoレベルのログを出力する
   *
   * @param {string} message
   */
  public static info(message: string) {
    const logger = Log4js.getLogger('bot');
    logger.info(message);
  }

  /**
   * warnレベルのログを出力する
   *
   * @param {string} message
   */
  public static warn(message: string) {
    const logger = Log4js.getLogger('bot');
    logger.warn(message);
  }

  /**
   * errorレベルのログを出力する
   *
   * @param {string} message
   */
  public static error(message: string) {
    const logger = Log4js.getLogger('bot');
    logger.error(message);
  }
}
