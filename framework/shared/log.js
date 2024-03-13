// @ts-check
import minify from "/framework/shared/html/minify.js";

const MAX_MESSAGE_LENGTH = 128;
const MAX_DETAIL_LENGTH = 256;

const LOG_LEVELS = {
  debug: 0,
  info: 1,
  data: 2,
  warn: 3,
  error: 4,
  critical: 5
};

/**
 * Log a message to the console
 * @param {object} options
 * @param {string} options.message the message to log
 * @param {object} [options.detail] additional data to log
 * @param {("debug" | "info" | "warn" | "error")} [options.level] one of "debug", "info", "warn", "error"
 * @param {typeof console} [options._console] for testing
 * @returns {void} Nothing: logs to console
 */
const Log = ({ message, detail, level = "info", _console = console }) => {
  /** @type {{ o: string, l: number, m: string, d?: string }} */
  const logObject = {
    o: new Date().toISOString(),
    l: LOG_LEVELS[level],
    m: message.trim().slice(0, MAX_MESSAGE_LENGTH)
  };

  if (logObject.m.length === MAX_MESSAGE_LENGTH) {
    logObject.m += "…";
  }

  if (detail) {
    logObject.d = minify(JSON.stringify(detail)).slice(0, MAX_DETAIL_LENGTH);

    if (logObject.d.length === MAX_DETAIL_LENGTH) {
      logObject.d += "…";
    }
  }

  _console[level](JSON.stringify(logObject));
};

/**
 * Logs an error to the console
 * @param {Error} error the error to log
 * @returns {void} Nothing: logs to console
 * @example
 * LogError(new Error("Something went wrong"));
 * // {"o":"2020-01-01T00:00:00.000Z","l":4,"m":"Something went wrong"}
 */
export const LogError = (error) =>
  Log({ message: error.message, detail: error, level: "error" });
export default Log;
