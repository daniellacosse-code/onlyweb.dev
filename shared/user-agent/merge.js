// @ts-check

/**
 * @typedef {import("./model.js").PlatformRequirements} PlatformRequirements
 * @typedef {import("./model.js").PlatformEngine} PlatformEngine
 * @typedef {import("./model.js").PlatformRenderer} PlatformRenderer
 */

/**
 * Merge multiple platform requirements into a single set of requirements.
 * @param {PlatformRequirements[]} requirements The requirements to merge
 * @returns {PlatformRequirements} The merged requirements
 * @example const requirements = merge(
 *  { engine: { Chrome: 91 }, renderer: { Chromium: 91 } },
 * { engine: { Firefox: 91 }, renderer: { Gecko: 91 } }
 * );
 * console.log(requirements);
 * // {
 * //   engine: { Chrome: 91, Firefox: 91 },
 * //   renderer: { Chromium: 91, Gecko: 91 }
 * // }
 */
export default (...requirements) => {
  /** @type {import("./model.js").PlatformRequirements} */
  const result = requirements[0];

  for (const requirement of requirements) {
    if (!requirement) continue;

    if (requirement.engine) {
      result.engine ??= {};

      for (const untypedEngineName in requirement.engine) {
        const engineName = /** @type {PlatformEngine} */ (untypedEngineName);

        result.engine[engineName] = Math.max(
          result.engine[engineName] ?? 0,
          requirement.engine[engineName] ?? 0
        );
      }
    }

    if (requirement.renderer) {
      result.renderer ??= {};

      for (const untypedRendererName in requirement.renderer) {
        const rendererName = /** @type {PlatformRenderer} */ (
          untypedRendererName
        );

        result.renderer[rendererName] = Math.max(
          result.renderer[rendererName] ?? 0,
          requirement.renderer[rendererName] ?? 0
        );
      }
    }
  }

  return result;
};
