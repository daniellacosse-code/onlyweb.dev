import type { OWFResponse } from "./types.ts";

/**
 * Unwraps an OWFResponse into a standard Response.
 * @param response The OWFResponse.
 * @returns The standard Response.
 */
export const unwrapResponse = (response: OWFResponse): Response => {
  return response.nativeResponse;
};
