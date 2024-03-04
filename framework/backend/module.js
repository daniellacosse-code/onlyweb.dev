import start from "./start.js";

import * as CONSTANTS from "./constants.js";

import Inliner from "./page/inliner.js";
import Register from "./page/register.js";
import * as __Response from "./page/response.js";

const _Response = __Response.default;

_Response.html = __Response.html;
_Response.js = __Response.js;

export default {
  ...CONSTANTS,
  start,
  Page: {
    Inliner,
    Register,
    Response: _Response
  }
};
