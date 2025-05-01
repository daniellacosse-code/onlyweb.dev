/**
 * Represents the canonical names for known browser engines.
 * These are typically the user-facing browser names or underlying projects.
 */
export type PlatformEngine =
  | "Chrome"
  | "Chromium"
  | "Edge"
  | "Firefox"
  | "Opera"
  | "OperaLegacy" // Older versions of Opera using the Presto engine
  | "Safari"
  | "Seamonkey";

/**
 * Represents an instance of a detected browser engine, including its name and version.
 */
export type PlatformEngineInstance = {
  /** The canonical name of the browser engine. */
  name: PlatformEngine;
  /** The detected major version number of the engine, if available. */
  version?: number;
};

/**
 * Represents the canonical names for known rendering engines.
 * These are the core layout engines used by browsers.
 */
export type PlatformRenderer =
  | "Gecko" // Used by Firefox, Seamonkey
  | "WebKit" // Used by Safari, older Chrome/Opera versions
  | "Blink" // Used by Chrome, Chromium, Edge, Opera
  | "Presto" // Used by older Opera versions (OperaLegacy)
  | "EdgeHTML"; // Used by older Edge versions

/**
 * Represents an instance of a detected rendering engine, including its name and version.
 */
export type PlatformRendererInstance = {
  /** The canonical name of the rendering engine. */
  name: PlatformRenderer;
  /** The detected major version number of the renderer, if available. */
  version?: number;
};

/**
 * Encapsulates the detected rendering engine and browser engine for a given user agent.
 */
export type Platform = {
  /** The detected rendering engine instance. */
  renderer: PlatformRendererInstance;
  /** The detected browser engine instance. */
  engine: PlatformEngineInstance;
};

/**
 * Defines minimum version requirements for platform engines and/or renderers.
 * This type is used to specify the compatibility criteria needed for certain features or functionalities.
 * For example, requiring Chrome version 91 or higher.
 */
export type PlatformRequirements = {
  /**
   * A map of browser engine names to their minimum required major version.
   * Example: `{ Chrome: 91, Firefox: 90 }`
   */
  engine?: Partial<Record<PlatformEngine, number>>;
  /**
   * A map of rendering engine names to their minimum required major version.
   * Example: `{ Blink: 91, Gecko: 90 }`
   */
  renderer?: Partial<Record<PlatformRenderer, number>>;
};
