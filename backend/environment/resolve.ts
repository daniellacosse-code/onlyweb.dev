import * as defaults from "./defaults.ts";

/**
 * Resolve an environment variable, or fallback to a constant.
 *
 * This function attempts to retrieve the value of an environment variable specified by `key`.
 * If the environment variable is not set, it falls back to the corresponding constant value defined in the `defaults` module.
 * The returned value is always a string.
 *
 * @param key The key of the environment variable to resolve. This should be a key present in the `defaults` module.
 * @returns The resolved value, either from the environment variable or the constant.
 */
export const resolveEnvironment = (
  key: keyof typeof defaults,
): string => {
  return String(Deno.env.get(key) ?? defaults[key]);
};
