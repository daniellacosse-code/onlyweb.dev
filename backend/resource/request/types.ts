/**
 * Represents a request made to the Only Web Framework.
 */
export interface OWFRequest {
  /** The language of the request. */
  language: string;
  /** The URL of the request. */
  url: URL;
  /** The native request object. */
  nativeRequest: Request;
}
