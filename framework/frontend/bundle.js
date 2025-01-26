import requirements from "./requirements.js";
import html from "./element/html.js";
import Register from "./element/register.js";

/**
 * A module containing the frontend-specific aspects of the framework.
 * @module Frontend
 */
globalThis.$Frontend = {
  requirements,
  Element: {
    Register,
    html
  }
};

export default globalThis.$Frontend;
