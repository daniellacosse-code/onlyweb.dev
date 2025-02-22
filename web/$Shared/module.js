import handleTemplate from "./handleTemplate.js";

import escape from "./HTML/escape.js";
import minify from "./HTML/minify.js";

import parse from "./UserAgent/parse.js";
import check from "./UserAgent/check.js";
import merge from "./UserAgent/merge.js";

import Log, { LogError } from "./Log.js";

/**
 * A handful of shared utilities that can be utilized across the frontend and backend.
 * @module Shared
 */
export default {
  handleTemplate,
  HTML: {
    escape,
    minify,
  },
  Log,
  LogError,
  UserAgent: {
    check,
    merge,
    parse,
  },
};
