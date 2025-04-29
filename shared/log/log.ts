import { minifyHtml } from "../html/minify.ts";

/** @internal Maximum length for the primary log message. */
const MAX_MESSAGE_LENGTH = 128;
/** @internal Maximum length for the stringified detail object after potential minification. */
const MAX_DETAIL_LENGTH = 256;

/** @internal Mapping of log level names to their numerical representation. */
const LOG_LEVELS = {
  debug: 0,
  info: 1,
  warn: 2,
  error: 3,
};

/**
 * Defines a basic console interface subset used for logging.
 * This allows injecting alternative logging mechanisms (e.g., for testing or
 * sending logs to a different destination).
 */
export interface ConsoleLike {
  /**
   * Logs a debug message, typically used for detailed diagnostic information.
   * @param {string} payload - The string message to log.
   */
  debug: (...payload: string[]) => void;

  /**
   * Logs an informational message, indicating routine operations or events.
   * @param {string} payload - The string message to log.
   */
  info: (...payload: string[]) => void;

  /**
   * Logs a warning message, indicating potential issues that don't necessarily halt execution.
   * @param {string} payload - The string message to log.
   */
  warn: (...payload: string[]) => void;

  /**
   * Logs an error message, indicating a problem or failure has occurred.
   * @param {string} payload - The string message to log.
   */
  error: (...payload: string[]) => void;
}

/**
 * Defines the parameters accepted by the main `log` function.
 */
export type LogParameters = {
  /**
   * The primary log message. Will be trimmed and truncated if it exceeds
   * `MAX_MESSAGE_LENGTH`.
   */
  message: string;

  /**
   * Optional structured data providing additional context. This object will be
   * `JSON.stringify`-ed, potentially minified using `minifyHtml` (if the JSON
   * contains HTML-like strings), and truncated if it exceeds `MAX_DETAIL_LENGTH`.
   */
  detail?: object;

  /**
   * The severity level of the log entry. Determines which method on the
   * `ConsoleLike` interface is called.
   * @default 'info'
   */
  level?: keyof ConsoleLike;

  /**
   * An optional override for the console object. Primarily used for dependency
   * injection, enabling testing or custom logging implementations.
   * @default globalThis.console
   * @internal
   */
  _console?: ConsoleLike;
};

/**
 * Represents the structured object that is ultimately stringified and logged.
 * Uses abbreviated keys to minimize payload size.
 * @internal
 */
type LogObject = {
  /** Timestamp of the log entry in ISO 8601 format. (Key: 'o') */
  o: string;

  /** Numerical representation of the log level. (Key: 'l') */
  l: number;

  /** The processed log message (trimmed, truncated). (Key: 'm') */
  m: string;

  /** The processed detail string (stringified, minified, truncated), if provided. (Key: 'd') */
  d?: string;
};

/**
 * Logs a structured message to the provided console interface.
 *
 * It formats the message and details into a `LogObject`, truncates them
 * if necessary, stringifies the result to JSON, and then calls the appropriate
 * method (`debug`, `info`, `warn`, `error`) on the console object.
 *
 * @param {LogParameters} parameters - The parameters for the log entry.
 * @param {string} parameters.message - The main message to log.
 * @param {object} [parameters.detail] - Optional additional data.
 * @param {keyof ConsoleLike} [parameters.level='info'] - The log level.
 * @param {ConsoleLike} [parameters._console=globalThis.console] - The console object to use.
 * @returns {void} This function does not return a value; its primary effect is logging to the console.
 */
export const log = (
  {
    message,
    detail,
    level = "info",
    _console = (globalThis as any).console,
  }: LogParameters,
): void => {
  // Ensure a valid console object is available
  const consoleInstance = _console ?? (globalThis as any).console;
  if (!consoleInstance?.[level]) {
    // Fallback or error if the console or level method is invalid
    _console.error(`Invalid console or log level "${level}" provided.`);
    return;
  }

  const logObject: LogObject = {
    o: new Date().toISOString(),
    l: LOG_LEVELS[level], // Assumes level is always a valid key here based on LogParameters type
    m: message.trim().slice(0, MAX_MESSAGE_LENGTH),
  };

  // Add ellipsis if message was truncated
  if (message.trim().length > MAX_MESSAGE_LENGTH) {
    logObject.m += "…";
  }

  if (detail) {
    try {
      // Stringify, potentially minify (useful if detail contains HTML strings), and truncate
      logObject.d = minifyHtml(JSON.stringify(detail)).slice(
        0,
        MAX_DETAIL_LENGTH,
      );

      // Add ellipsis if detail string was truncated
      if (minifyHtml(JSON.stringify(detail)).length > MAX_DETAIL_LENGTH) {
        logObject.d += "…";
      }
    } catch (e) {
      // Handle potential JSON stringification errors
      logObject.d = `[Error stringifying detail: ${
        e instanceof Error ? e.message : String(e)
      }]`.slice(0, MAX_DETAIL_LENGTH);
      if (logObject.d.length === MAX_DETAIL_LENGTH) {
        logObject.d += "…";
      }
    }
  }

  try {
    // Log the final stringified object
    _console[level](JSON.stringify(logObject));
  } catch (e) {
    // Fallback logging if stringifying the final logObject fails (less likely)
    _console.error(
      "Failed to stringify log object:",
      (e as Error).message,
      JSON.stringify(logObject),
    );
  }
};

/**
 * A convenience function to log an `Error` object.
 * It extracts the error message and uses the error object itself as the detail,
 * automatically setting the level to 'error'.
 *
 * @param {Error} error - The Error object to log.
 * @returns {void} This function does not return a value; its primary effect is logging to the console.
 * @example
 * ```js
 * try {
 *   throw new Error("Something went wrong");
 * } catch (err) {
 *   if (err instanceof Error) {
 *     logError(err);
 *     // Example Console Output (timestamp will vary):
 *     // {"o":"2023-10-27T10:00:00.000Z","l":4,"m":"Something went wrong","d":"{}"}
 *     // Note: The default JSON.stringify(error) might just produce "{}" depending on the environment.
 *     // Consider adding error.stack or other properties to `detail` if needed.
 *   }
 * }
 * ```
 */
export const logError = ({ message, ...error }: Error): void =>
  log({ message, detail: { ...error }, level: "error" });
