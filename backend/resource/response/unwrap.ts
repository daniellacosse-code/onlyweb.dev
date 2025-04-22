import type { OWFResponse } from "./types.ts";

/**
 * Unwraps an OWFResponse into a standard Response.
 * @param response The OWFResponse.
 * @returns The standard Response.
 */
export const unwrapResponse = (response: OWFResponse): Response => {
  return response.nativeResponse;
};

/**
 * Checks if a value is an OWFResponse.
 * @param response The value to check.
 * @returns True if the value is an OWFResponse, false otherwise.
 */
export const isOWFResponse = (response: unknown): response is OWFResponse => {
  if (typeof response !== "object" || response === null) {
    return false;
  }

  const potentialResponse = response as Partial<OWFResponse>;
  return (
    typeof potentialResponse.mimetype === "string" &&
    typeof potentialResponse.content === "string" &&
    potentialResponse.nativeResponse instanceof Response
  );
};
