import type { OWFRequest } from "./types.ts";

/**
 * Wraps a standard Request in an OWFRequest.
 * @param request The standard Request.
 * @returns The OWFRequest.
 */
export const wrapRequest = (request: Request): OWFRequest => {
  const url = new URL(request.url);
  return {
    language: url.searchParams.get("lang") ??
      request.headers.get("accept-language")?.split(",")[0] ??
      "en-US",
    url,
    nativeRequest: request,
  };
};
