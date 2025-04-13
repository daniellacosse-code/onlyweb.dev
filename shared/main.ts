import escape from "./html/escape.js";
import minify from "./html/minify.js";

/**
 * A collection of HTML utilities.
 * @module Shared
 */
export const HTML = {
  escape,
  minify
};

import parse from "./user-agent/parse.js";
import check from "./user-agent/check.js";
import merge from "./user-agent/merge.js";

/**
 * A collection of User Agent utilities.
 * @module Shared
 */
export const UserAgent = {
  parse,
  check,
  merge,
};

export {default as Log, LogError} from "./log.js";
export {default as handleTemplate} from "./handle-template.js";
