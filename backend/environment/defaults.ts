/**
 * The default port for the OnlyWeb framework server.
 */
export const OWF_APPLICATION_PORT = 3210;

/**
 * The default base CDN url for the OnlyWeb framework server.
 */
export const OWF_SOURCE_CDN = "https://esm.sh/jsr";

/**
 * Whether or not to allow robots to index the site.
 */
export const OWF_ALLOW_ROBOTS = true;

/**
 * The domains that are allowed to access the site.
 *
 * @example
 * "esm.sh cdn.myhost.org"
 */
export const OWF_ALLOW_DOMAINS = "";

/**
 * The root directory for the OnlyWeb framework server.
 */
export const OWF_ROOT_DIR: string = Deno.cwd();
