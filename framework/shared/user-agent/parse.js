/**
 * @typedef Platform
 * @property {Object} renderer
 * @property {string} renderer.name
 * @property {string} renderer.version
 * @property {Object} engine
 * @property {string} engine.name
 * @property {string} engine.version
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

const RENDERER_CHECKERS = {
  Gecko: /Gecko\/(?<version>\S+)/,
  WebKit: /WebKit\/(?<version>\S+)/,
  Blink: /Blink\/(?<version>\S+)/,
  Presto: /Presto\/(?<version>\S+)/,
  EdgeHTML: /Edge\/(?<version>\S+)/
};

/**
 * Parse a user agent string and return the platform information.
 * @param {string} userAgent
 * @returns {Readonly<Platform>} - A frozen object with the platform information.
 */
export default (userAgent) => {
  const platform = {};

  // usually the first match is the renderer
  for (const rendererName in RENDERER_CHECKERS) {
    const result = userAgent.match(RENDERER_CHECKERS[rendererName]);

    if (result?.groups?.version) {
      platform.renderer = {
        name: rendererName,
        version: result.groups.version
      };
      break;
    }
  }

  // engines are more complicated, we need to check all of them
  const engines = {};
  for (const engineName in ENGINE_CHECKERS) {
    const result = userAgent.match(ENGINE_CHECKERS[engineName]);

    if (result?.groups?.version) {
      engines[engineName] = {
        name: engineName,
        version: result.groups.version
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
