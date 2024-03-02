import Inliner from "./inliner.js";
import Register from "./register.js";
import * as __Response from "./response.js";

const _Response = __Response.default;

_Response.html = __Response.html;
_Response.js = __Response.js;

export default {
  Inliner,
  Register,
  Response: _Response
};
