/**
 * A response to a page request.
 * Extends the standard Response interface.
 */
export interface OWFResponse {
  /** The mimetype of the response. */
  mimetype: string;
  /** TODO */
  nativeResponse: Response;
}

/**
 * Creates an OWFResponse from a standard Response.
 * @param response The standard Response.
 * @param mimetype The mimetype of the response. If not provided, it will be inferred from the response headers.
 * @returns An OWFResponse.
 */
export const makeOWFResponse = (
  response: Response,
  mimetype?: string,
): OWFResponse => {
  return {
    mimetype: mimetype ?? response.headers.get("Content-Type") ?? "text/plain",
    nativeResponse: response,
  };
};
