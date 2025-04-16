/**
 * Canonical names for platform engines
 */
export type PlatformEngine =
  | 'Chrome'
  | 'Chromium'
  | 'Edge'
  | 'Firefox'
  | 'Opera'
  | 'OperaLegacy'
  | 'Safari'
  | 'Seamonkey';

/**
 * Instance of a user agent platform engine
 */
export type PlatformEngineInstance = {
  name: PlatformEngine;
  version?: number;
};

/**
 * Canonical names for platform renderers
 */
export type PlatformRenderer =
  | 'Gecko'
  | 'WebKit'
  | 'Blink'
  | 'Presto'
  | 'EdgeHTML';

/**
 * Instance of a user agent platform renderer
 */
export type PlatformRendererInstance = {
  name: PlatformRenderer;
  version?: number;
};

/**
 * The current web renderer and browser engine in use
 */
export type Platform = {
  renderer: PlatformRendererInstance;
  engine: PlatformEngineInstance;
};

/**
 * A set of platform requirements
 */
export type PlatformRequirements = {
  engine?: Partial<Record<PlatformEngine, number>>;
  renderer?: Partial<Record<PlatformRenderer, number>>;
};
