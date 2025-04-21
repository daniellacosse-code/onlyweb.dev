/**
 * A request for a page.
 * Wraps the standard Request interface.
 */
export interface OWFRequest {
  /** The language of the request. */
  language: string;
  /** The URL of the request. */
  url: URL;
  /** TODO */
  nativeRequest: Request;
}

/**
 * Creates an OWFRequest from a standard Request.
 * @param request The standard Request.
 * @returns The OWFRequest.
 */
export const makeOWFRequest = (request: Request): OWFRequest => {
  const url = new URL(request.url);
  return {
    language: url.searchParams.get("lang") ??
      request.headers.get("accept-language")?.split(",")[0] ??
      "en-US",
    url,
    nativeRequest: request,
  };
};
