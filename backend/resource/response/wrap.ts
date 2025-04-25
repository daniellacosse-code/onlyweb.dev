import type { OWFResponse } from "./types.ts";

/**
 * Wraps a standard Response in an OWFResponse.
 * @param response The standard Response.
 * @returns A Promise containing the OWFResponse.
 */
export const wrapResponse = async (
  response: Response,
): Promise<OWFResponse> => {
  return {
    mimetype: response.headers.get("content-type") ?? "text/plain",
    content: await response.text(),
    nativeResponse: response,
  };
};

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
