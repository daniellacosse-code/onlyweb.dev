/**
 * A request for a page.
 * Extends the standard Request interface.
 */
export interface PageRequest extends Request {
  /** The language of the request. */
  language: string;
  /** The parsed URL of the request. */
  parsedUrl: URL;
}

/**
 * A response to a page request.
 * Extends the standard Response interface.
 */
export interface PageResponse extends Response {
  /** The mimetype of the response. */
  mimetype: string;
}

/**
 * A utility for creating a templateable page response with a specific mimetype.
 * Represents a function that takes template literals and returns a PageResponse.
 */
export type PageTemplate = (
  templateArray: TemplateStringsArray,
  ...insertions: any[]
) => PageResponse;

/**
 * A handler for a page request.
 * Represents an async function that takes a PageRequest and returns a Promise of a PageResponse.
 */
export type PageHandler = (request: PageRequest) => Promise<Response | PageResponse>;

/**
 * A context-aware inliner that can inline elements, messages, and metadata into a document.
 */
export interface Inliner {
  /** Inlines the given custom element registrations into the HTML document. */
  elements: (...functionOrFilePath: Array<string | Function>) => Response;
  /** Retrieves the translated message for a given key. */
  message: (message: string) => string;
  /** Inlines the given metadata into the HTML document. */
  metadata: (metadata: InlineHTMLMetadata) => Response;
  /** Inlines the given framework bundles into the HTML document. */
  frameworkBundles: (...frameworkBundles: Array<string>) => Promise<Response>;
}

/**
 * Metadata that can be inlined into an HTML document.
 */
export interface InlineHTMLMetadata {
  /** The description of the page. */
  description?: string;
  /** The path to the icon image of the page. */
  iconImagePath?: string;
  /** The path to the preview image of the page. */
  previewImagePath?: string;
  /** The path to the splash image of the page. */
  splashImagePath?: string;
  /** The title of the page. */
  title?: string;
  /** The canonical URL of the page. */
  canonicalUrl: string;
}
