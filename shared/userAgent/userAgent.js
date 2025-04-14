/**
 * @namespace UserAgent
 * @description Model for interacting with user agent strings
 */

/**
 * @memberof UserAgent
 * @description The current web renderer and brower engine in use
 * @typedef {{ renderer: PlatformRendererInstance, engine: PlatformEngineInstance }} Platform
 */

/**
 * @memberof UserAgent
 * @description Canonical names for platform renderers
 * @typedef {('Gecko'|'WebKit'|'Blink'|'Presto'|'EdgeHTML')} PlatformRenderer
 */

/**
 * @memberof UserAgent
 * @description Instance of a user agent platform renderer
 * @typedef {{ name: PlatformRenderer, version?: number }} PlatformRendererInstance
 */

/**
 * @memberof UserAgent
 * @description Canonical names for platform engines
 * @typedef {('Chrome'|'Chromium'|'Edge'|'Firefox'|'Opera'|'OperaLegacy'|'Safari'|'Seamonkey')} PlatformEngine
 */

/**
 * @memberof UserAgent
 * @description Instance of a user agent platform engine
 * @typedef {{ name: PlatformEngine, version?: number }} PlatformEngineInstance
 */

/**
 * @memberof UserAgent
 * @description A set of platform requirements
 * @typedef {Object} PlatformRequirements
 * @property {Partial<{ [engine in PlatformEngine]: number }>} engine
 * @property {Partial<{ [renderer in PlatformRenderer]: number }>} renderer
 */

/**
 * A utility for checking if a user agent meets certain requirements
 * @param {Readonly<Platform>} platform The platform to check
 * @param {PlatformRequirements} requirements The requirements to check against
 * @returns {boolean} Whether or not the platform meets the requirements
 * @example
 *
 * ```js
 * const userAgent = navigator.userAgent;
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
 * ```
 */
export const check = ({ engine, renderer }, requirements) => {
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

/**
 * Merge multiple platform requirements into a single set of requirements.
 * @param {PlatformRequirements[]} requirements The requirements to merge
 * @returns {PlatformRequirements} The merged requirements
 * @example
 *
 * ```js
 * const requirements = merge(
 *   { engine: { Chrome: 91 }, renderer: { Chromium: 91 } },
 *   { engine: { Firefox: 91 }, renderer: { Gecko: 91 } }
 * );
 * console.log(requirements);
 * // {
 * //   engine: { Chrome: 91, Firefox: 91 },
 * //   renderer: { Chromium: 91, Gecko: 91 }
 * // }
 * ```
 */
export const merge = (...requirements) => {
  /** @type {PlatformRequirements} */
  const result = requirements[0];

  for (const requirement of requirements) {
    if (!requirement) continue;

    if (requirement.engine) {
      result.engine ??= {};

      for (const untypedEngineName in requirement.engine) {
        const engineName = /** @type {PlatformEngine} */ (untypedEngineName);

        result.engine[engineName] = Math.max(
          result.engine[engineName] ?? 0,
          requirement.engine[engineName] ?? 0,
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
          requirement.renderer[rendererName] ?? 0,
        );
      }
    }
  }

  return result;
};

/**
 * @type {{ [engine in PlatformEngine]: RegExp }}
 */
const ENGINE_CHECKERS = {
  Firefox: /Firefox\/(?<version>\S+)/,
  Seamonkey: /Seamonkey\/(?<version>\S+)/,
  Chrome: /Chrome\/(?<version>\S+)/,
  Chromium: /Chromium\/(?<version>\S+)/,
  Edge: /Edg.*\/(?<version>\S+)/,
  Safari: /Safari\/(?<version>\S+)/,
  OperaLegacy: /Opera\/(?<version>\S+)/,
  Opera: /OPR\/(?<version>\S+)/,
};

/**
 * @type {{ [renderer in PlatformRenderer]: RegExp }}
 */
const RENDERER_CHECKERS = {
  Gecko: /Gecko\/(?<version>\S+)/,
  WebKit: /WebKit\/(?<version>\S+)/,
  Blink: /Blink\/(?<version>\S+)/,
  Presto: /Presto\/(?<version>\S+)/,
  EdgeHTML: /Edge\/(?<version>\S+)/,
};

/**
 * Parse a user agent string and return the platform information.
 * @param {string} userAgent The user agent string to parse.
 * @returns {Readonly<Platform>} A frozen object with the platform information.
 * @example
 *
 * ```js
 * const platform = parse(navigator.userAgent);
 * console.log(platform);
 * // {
 * //   renderer: {
 * //     name: "Blink",
 * //     version: 91
 * //   },
 * //   engine: {
 * //     name: "Chrome",
 * //     version: 91
 * //   }
 * // }
 * ```
 */
export const parse = (userAgent) => {
  /** @type {Platform} */
  const platform = {};

  // usually the first match is the renderer
  for (const untypedRendererName in RENDERER_CHECKERS) {
    const rendererName = /** @type {PlatformRenderer} */ (untypedRendererName);

    const result = userAgent.match(RENDERER_CHECKERS[rendererName]);

    if (result?.groups?.version) {
      platform.renderer = {
        name: rendererName,
        version: parseFloat(result.groups.version),
      };
      break;
    }
  }

  // engines are more complicated, we need to check all of them
  /** @type {Partial<{ [engine in PlatformEngine]: PlatformEngineInstance}>} */
  const engines = {};
  for (const untypedEngineName in ENGINE_CHECKERS) {
    const engineName = /** @type {PlatformEngine} */ (untypedEngineName);

    const result = userAgent.match(ENGINE_CHECKERS[engineName]);

    if (result?.groups?.version) {
      engines[engineName] = {
        name: engineName,
        version: parseFloat(result.groups.version),
      };
    }
  }

  // best we can do is this pseudo-switch statement
  if (engines.Firefox && !engines.Seamonkey) platform.engine = engines.Firefox;
  if (engines.Seamonkey) platform.engine = engines.Seamonkey;
  if (engines.Chrome && !engines.Chromium && !engines.Edge) {
    platform.engine = engines.Chrome;
  }
  if (engines.Chromium) platform.engine = engines.Chromium;
  if (engines.Safari && !engines.Chrome && !engines.Chromium) {
    platform.engine = engines.Safari;
  }
  if (engines.OperaLegacy) platform.engine = engines.OperaLegacy;
  if (engines.Opera) platform.engine = engines.Opera;

  return Object.freeze(platform);
};
