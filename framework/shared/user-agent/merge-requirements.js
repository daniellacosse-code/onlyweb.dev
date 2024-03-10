// @ts-check

/**
 * Merge multiple platform requirements into a single set of requirements.
 * @param {import("./model.js").PlatformRequirements[]} requirements The requirements to merge
 * @returns {import("./model.js").PlatformRequirements} The merged requirements
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

      for (const _engineName in requirement.engine) {
        /** @type {import("./model.js").PlatformEngine} */
        const engineName = _engineName;

        result.engine[engineName] = Math.max(
          result.engine[engineName] ?? 0,
          requirement.engine[engineName] ?? 0
        );
      }
    }

    if (requirement.renderer) {
      result.renderer ??= {};

      for (const _rendererName in requirement.renderer) {
        /** @type {import("./model.js").PlatformRenderer} */
        const rendererName = _rendererName;

        result.renderer[rendererName] = Math.max(
          result.renderer[rendererName] ?? 0,
          requirement.renderer[rendererName] ?? 0
        );
      }
    }
  }

  return result;
};
