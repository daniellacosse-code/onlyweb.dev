import type { Platform, PlatformRequirements } from "./types.ts";

/**
 * A utility for checking if a user agent meets certain requirements
 * @param platform The platform to check
 * @param requirements The requirements to check against
 * @returns Whether or not the platform meets the requirements
 * @example
 *
 * ```js
 * const userAgent = navigator.userAgent;
 * const platform = parseAgent(userAgent);
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
 * ```
 */
export const checkAgent = (
  { engine, renderer }: Readonly<Platform>,
  requirements: PlatformRequirements,
): boolean => {
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
