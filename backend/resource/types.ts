import type { OWFRequest } from "./request/types.ts";
import type { OWFResponse } from "./response/types.ts";

/**
 * A resource is a function that takes a request and returns a response.
 * It is the basic building block of the Only Web Framework.
 * It is registered in the resource registry.
 * It is called by the router.
 * It is responsible for handling a specific type of request.
 * It is responsible for returning a specific type of response.
 */
export type OWFResource = (request: OWFRequest) => Promise<OWFResponse>;
