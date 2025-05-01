import { Registry } from "@onlyweb/shared";

import type { OWFResource } from "./types.ts";

/**
 * Singleton internal registry for resources
 * @private
 */
export const resourceRegistry = new Registry<OWFResource>();
