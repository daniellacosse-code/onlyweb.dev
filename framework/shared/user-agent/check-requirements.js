//@ts-check

import type { Platform } from "./parse.js";

/**
 * @name check
 * @description A utility for checking if a user agent meets certain requirements
 * @param {Readonly<Platform>} platform
 * @param {object} requirements
 * @param {object} requirements.engine
 * @param {object} requirements.renderer
 * @returns {boolean}
 * @example const userAgent = navigator.userAgent;
 * const platform = parse(userAgent);
 * const requirements = {
 *   engine: {
 *     Chrome: "91.0.4472.124"
 *   },
 *   renderer: {
 *     Chromium: "91.0.4472.124"
 *   }
 * };
 * const meetsRequirements = check(platform, requirements);
 * console.log(meetsRequirements); // returns true
 */
export default ({ engine, renderer }, requirements) => {
  let result = true;

  if (requirements.engine) {
    result &&=
      parseFloat(engine.version) >=
      parseFloat(requirements.engine[engine.name]);
  }

  if (requirements.renderer) {
    result &&=
      parseFloat(renderer.version) >=
      parseFloat(requirements.renderer[renderer.name]);
  }

  return result;
};
