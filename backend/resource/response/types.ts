/**
 * An Only Web Framework response.
 * Wraps the standard Response interface.
 */
export interface OWFResponse {
  /** The mimetype of the response. */
  mimetype: string;
  /** The content of the response. */
  content: string;
  /** The standard Response. */
  nativeResponse: Response;
}
