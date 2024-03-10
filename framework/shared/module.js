import escape from "./html/escape.js";
import minify from "./html/minify.js";

import parse from "./user-agent/parse.js";
import check from "./user-agent/check-requirements.js";
import merge from "./user-agent/merge-requirements.js";

/**
 * @module Shared
 * @description A handful of shared utilities that can be utilized across the frontend and backend.
 */
export default {
  UserAgent: {
    parse,
    check,
    merge
  },
  HTML: {
    escape,
    minify
  }
};
