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
