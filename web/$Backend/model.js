/**
 * A page resource.
 * @namespace Page
 */

/**
 * A request for a page.
 * @typedef PageRequest
 * @memberof Page
 * @extends Request
 * @property {string} language The language of the request.
 * @property {URL} url The URL of the request.
 */

/**
 * A response to a page request.
 * @typedef PageResponse
 * @memberof Page
 * @extends Response
 * @property {string} mimetype The mimetype of the response.
 */

/**
 * A utility for creating a templateable page response with a specific mimetype.
 * @typedef {(templateArray: TemplateStringsArray, ...insertions: any[]) => PageResponse} PageTemplate
 * @memberof Page
 */

/**
 * A handler for a page request.
 * @typedef {(request: PageRequest) => Promise<PageResponse>} PageHandler
 * @memberof Page
 */

/**
 * A context-aware inliner that can inline elements, messages, and metadata into a document.
 * @typedef Inliner
 * @property {(...functionOrFilePath: Array<string | function>) => Response} elements Inlines the given custom element registrations into the HTML document.
 * @property {(message: string) => string} message Retrieves the translated message for a given key.
 * @property {(metadata: InlineHTMLMetadata) => Response} metadata Inlines the given metadata into the HTML document.
 * @property {(...frameworkBundles: Array<string>) => Promise<Response>} frameworkBundles Inlines the given framework bundles into the HTML document.
 */

/**
 * Metadata that can be inlined into an HTML document.
 * @typedef InlineHTMLMetadata
 * @property {string} [description] The description of the page.
 * @property {string} [iconImagePath] The path to the icon image of the page.
 * @property {string} [previewImagePath] The path to the preview image of the page.
 * @property {string} [splashImagePath] The path to the splash image of the page.
 * @property {string} [title] The title of the page.
 * @property {string} canonicalUrl The canonical URL of the page.
 */
