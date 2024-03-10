import requirements from "./requirements.js";
import html from "./element/html.js";
import Register from "./element/register.js";

/**
 * @module Frontend
 * @description A module containing the frontend-specific aspects of the framework.
 */
export default {
  requirements,
  Element: {
    Register,
    html
  }
};
