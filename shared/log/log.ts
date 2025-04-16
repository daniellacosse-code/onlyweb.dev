import { htmlMinify } from "../html/minify.ts";

const MAX_MESSAGE_LENGTH = 128;
const MAX_DETAIL_LENGTH = 256;

const LOG_LEVELS = {
  debug: 0,
  info: 1,
  data: 2,
  warn: 3,
  error: 4,
  critical: 5,
};

/**
 * A runtime-independent logger interface.
 */
export interface ConsoleLike {
  /**
   * Logs a debug message.
   */
  debug: (payload: string) => void;

  /**
   * Logs an info message.
   */
  info: (payload: string) => void;

  /**
   * Logs a warning message.
   */
  warn: (payload: string) => void;

  /**
   * Logs an an error message.
   */
  error: (payload: string) => void;
};

/**
 * The parameters the logger takes.
 */
export type LogParameters = {
  /**
   * The message to log.
   */
  message: string;

  /**
   * Additional data to log.
   */
  detail?: object;

  /**
   * One of  "debug", "info", "warn", "error".
   */
  level?: keyof ConsoleLike;

  /**
   * For testing/logger injection.
   */
  _console?: ConsoleLike;
};

/**
 * The object the logger logs to the console.
 */
type LogObject = {
  /** The timestamp. */
  o: string;

  /** The log level. */
  l: number;

  /** The log message. */
  m: string;

  /** The log details. */
  d?: string;
};

/**
 * Log a message to the console
 * @param parameters 
 * @returns Nothing: logs to console
 */
export const log = (
  { 
    message,
    detail,
    level = "info",
    _console = (globalThis as any).console
  }: LogParameters,
): void => {
  const logObject: LogObject = {
    o: new Date().toISOString(),
    l: LOG_LEVELS[level],
    m: message.trim().slice(0, MAX_MESSAGE_LENGTH),
  };

  if (logObject.m.length === MAX_MESSAGE_LENGTH) {
    logObject.m += "…";
  }

  if (detail) {
    logObject.d = htmlMinify(JSON.stringify(detail)).slice(0, MAX_DETAIL_LENGTH);

    if (logObject.d.length === MAX_DETAIL_LENGTH) {
      logObject.d += "…";
    }
  }

  _console[level](JSON.stringify(logObject));
};

/**
 * Logs an error to the console
 * @param error the error to log
 * @returns Nothing: logs to console
 * @example
 *
 * ```js
 * LogError(new Error("Something went wrong"));
 * // {"o":"2020-01-01T00:00:00.000Z","l":4,"m":"Something went wrong"}
 * ```
 */
export const logError = (error: Error): void =>
  log({ message: error.message, detail: error, level: "error" });
