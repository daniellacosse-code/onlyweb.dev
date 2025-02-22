//@ts-check

/**
 * A utility for checking if a user agent meets certain requirements
 * @param {Readonly<import("./model.js").Platform>} platform The platform to check
 * @param {import("./model.js").PlatformRequirements} requirements The requirements to check against
 * @returns {boolean} Whether or not the platform meets the requirements
 * @example const userAgent = navigator.userAgent;
 * const platform = parse(userAgent);
 * const requirements = {
 *   engine: {
 *     Chrome: 91
 *   },
 *   renderer: {
 *     Chromium: 91
 *   }
 * };
 * const meetsRequirements = check(platform, requirements);
 * console.log(meetsRequirements); // returns true
 */
export default ({ engine, renderer }, requirements) => {
  let result = true;

  if (requirements.engine) {
    result &&= (engine.version ?? 0) >= (requirements.engine[engine.name] ?? 0);
  }

  if (requirements.renderer) {
    result &&=
      (renderer.version ?? 0) >= (requirements.renderer[renderer.name] ?? 0);
  }

  return result;
};
