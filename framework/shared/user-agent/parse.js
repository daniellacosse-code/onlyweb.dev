// @ts-check

/**
 * @type {{ [engine in import("./model.js").PlatformEngine]: RegExp }}
 */
const ENGINE_CHECKERS = {
  Firefox: /Firefox\/(?<version>\S+)/,
  Seamonkey: /Seamonkey\/(?<version>\S+)/,
  Chrome: /Chrome\/(?<version>\S+)/,
  Chromium: /Chromium\/(?<version>\S+)/,
  Edge: /Edg.*\/(?<version>\S+)/,
  Safari: /Safari\/(?<version>\S+)/,
  OperaLegacy: /Opera\/(?<version>\S+)/,
  Opera: /OPR\/(?<version>\S+)/
};

/**
 * @type {{ [renderer in import("./model.js").PlatformRenderer]: RegExp}}
 */
const RENDERER_CHECKERS = {
  Gecko: /Gecko\/(?<version>\S+)/,
  WebKit: /WebKit\/(?<version>\S+)/,
  Blink: /Blink\/(?<version>\S+)/,
  Presto: /Presto\/(?<version>\S+)/,
  EdgeHTML: /Edge\/(?<version>\S+)/
};

/**
 * Parse a user agent string and return the platform information.
 * @param {string} userAgent The user agent string to parse.
 * @returns {Readonly<import("./model.js").Platform>} A frozen object with the platform information.
 * @example
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
 */
export default (userAgent) => {
  /** @type {import("./model.js").Platform} */
  const platform = {};

  // usually the first match is the renderer
  for (const untypedRendererName in RENDERER_CHECKERS) {
    const rendererName = /** @type {import("./model.js").PlatformRenderer} */ (
      untypedRendererName
    );

    const result = userAgent.match(RENDERER_CHECKERS[rendererName]);

    if (result?.groups?.version) {
      platform.renderer = {
        name: rendererName,
        version: parseFloat(result.groups.version)
      };
      break;
    }
  }

  // engines are more complicated, we need to check all of them
  /** @type {Partial<{ [engine in import("./model.js").PlatformEngine]: import("./model.js").PlatformEngineInstance}>} */
  const engines = {};
  for (const untypedEngineName in ENGINE_CHECKERS) {
    const engineName = /** @type {import("./model.js").PlatformEngine} */ (
      untypedEngineName
    );

    const result = userAgent.match(ENGINE_CHECKERS[engineName]);

    if (result?.groups?.version) {
      engines[engineName] = {
        name: engineName,
        version: parseFloat(result.groups.version)
      };
    }
  }

  // best we can do is this pseudo-switch statement
  if (engines.Firefox && !engines.Seamonkey) platform.engine = engines.Firefox;
  if (engines.Seamonkey) platform.engine = engines.Seamonkey;
  if (engines.Chrome && !engines.Chromium && !engines.Edge)
    platform.engine = engines.Chrome;
  if (engines.Chromium) platform.engine = engines.Chromium;
  if (engines.Safari && !engines.Chrome && !engines.Chromium)
    platform.engine = engines.Safari;
  if (engines.OperaLegacy) platform.engine = engines.OperaLegacy;
  if (engines.Opera) platform.engine = engines.Opera;

  return Object.freeze(platform);
};
