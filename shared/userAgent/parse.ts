import type { 
  PlatformEngine,
  PlatformRenderer,
  Platform,
  PlatformEngineInstance
} from "./types.ts";

const ENGINE_CHECKERS: Record<PlatformEngine, RegExp> = {
  Firefox: /Firefox\/(?<version>\S+)/,
  Seamonkey: /Seamonkey\/(?<version>\S+)/,
  Chrome: /Chrome\/(?<version>\S+)/,
  Chromium: /Chromium\/(?<version>\S+)/,
  Edge: /Edg.*\/(?<version>\S+)/,
  Safari: /Safari\/(?<version>\S+)/,
  OperaLegacy: /Opera\/(?<version>\S+)/,
  Opera: /OPR\/(?<version>\S+)/
};

const RENDERER_CHECKERS: Record<PlatformRenderer, RegExp> = {
  Gecko: /Gecko\/(?<version>\S+)/,
  WebKit: /WebKit\/(?<version>\S+)/,
  Blink: /Blink\/(?<version>\S+)/,
  Presto: /Presto\/(?<version>\S+)/,
  EdgeHTML: /Edge\/(?<version>\S+)/
};

/**
 * Parse a user agent string and return the platform information.
 * @param userAgent The user agent string to parse.
 * @returns A frozen object with the platform information.
 * @throws TypeError when it fails to parse the UserAgent.
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
export const parseAgent = (userAgent: string): Readonly<Platform> => {
  let renderer, engine;

  // usually the first match is the renderer
  for (const untypedRendererName in RENDERER_CHECKERS) {
    const rendererName = untypedRendererName as PlatformRenderer;

    const result = userAgent.match(RENDERER_CHECKERS[rendererName]);

    if (result?.groups?.version) {
      renderer = {
        name: rendererName,
        version: parseFloat(result.groups.version)
      };
      break;
    }
  }

  // engines are more complicated, we need to check all of them
  const engines: Partial<Record<PlatformEngine, PlatformEngineInstance>> = {};
  for (const untypedEngineName in ENGINE_CHECKERS) {
    const engineName = untypedEngineName as PlatformEngine;

    const result = userAgent.match(ENGINE_CHECKERS[engineName]);

    if (result?.groups?.version) {
      engines[engineName] = {
        name: engineName,
        version: parseFloat(result.groups.version)
      };
    }
  }

  // best we can do is this pseudo-switch statement
  if (engines.Firefox && !engines.Seamonkey) engine = engines.Firefox;
  if (engines.Seamonkey) engine = engines.Seamonkey;
  if (engines.Chrome && !engines.Chromium && !engines.Edge)
    engine = engines.Chrome;
  if (engines.Chromium) engine = engines.Chromium;
  if (engines.Safari && !engines.Chrome && !engines.Chromium)
    engine = engines.Safari;
  if (engines.OperaLegacy) engine = engines.OperaLegacy;
  if (engines.Opera) engine = engines.Opera;

  if (!renderer || !engine) {
    throw new TypeError("Could not parse UserAgent.");
  }

  return Object.freeze({ renderer, engine });
};
