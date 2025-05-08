/**
 * The default host address for the OnlyWeb application server to listen on.
 * Uses `::1`, the IPv6 loopback address, by default.
 */
export const OWF_APPLICATION_HOST = "::1";

/**
 * The default port for the OnlyWeb framework server.
 */
export const OWF_APPLICATION_PORT = 3210;
/**
 * Whether the development watch mode is enabled by default.
 * When true, the server will watch for file changes and trigger client reloads.
 */
export const OWF_WATCH = false;

/**
 * The default host address for the development watch server to listen on.
 * Uses `127.0.0.1`, the IPv4 loopback address, by default for broader compatibility
 * in CSP and client connections.
 */
export const OWF_WATCH_HOST = "127.0.0.1";

/**
 * The default port for the development watch server.
 */
export const OWF_WATCH_PORT = 43210;

/**
 * The default base CDN url for the OnlyWeb framework server.
 * This is used to construct URLs for framework assets like `@onlyweb/frontend` and `@onlyweb/shared`.
 */
export const OWF_SOURCE_CDN = "https://esm.sh/jsr";

/**
 * Whether or not to allow robots to index the site.
 */
export const OWF_ALLOW_ROBOTS = true;

/**
 * The domains that are allowed to access the site.
 * This is a space-separated string of hostnames that will be added to the Content Security Policy (CSP).
 *
 * @example
 * "esm.sh cdn.myhost.org"
 */
export const OWF_ALLOW_DOMAINS = "";

/**
 * The root directory for serving static files for the OnlyWeb framework server, relative to the current working directory.
 */
export const OWF_ROOT_DIR: string = "/";
