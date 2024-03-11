import start from "./start.js";

import * as CONSTANTS from "./constants.js";

import Inliner from "./page/inliner.js";
import Register from "./page/register.js";
import * as __Response from "./page/response.js";

const _Response = __Response.default;

_Response.text = __Response.text;
_Response.html = __Response.html;
_Response.js = __Response.js;

/**
 * @module Backend
 * @description A module containing the backend-specific aspects of the framework.
 */
export default {
  ...CONSTANTS,
  start,
  Page: {
    Inliner,
    Register,
    Response: _Response
  }
};