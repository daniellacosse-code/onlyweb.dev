import type { PlatformRequirements } from "@onlyweb/shared";

/**
 * The userAgent requirements for the Only Web Framework.
 * These requirements largely come from the use of private fields during element registration.
 */
export const userAgent: PlatformRequirements = {
  engine: {
    Chrome: 74,
    Edge: 79,
    Safari: 14.5,
    Firefox: 90,
    Opera: 62,
  },
};
