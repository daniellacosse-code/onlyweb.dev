import elements from "./inline/elements.js";
import metadata from "./inline/metadata.js";
import Register from "./register.js";
import * as __Response from "./response.js";

const _Response = __Response.default;

_Response.html = __Response.html;
_Response.js = __Response.js;

export default {
  Inline: {
    elements,
    metadata
  },
  Register,
  Response: _Response
};
