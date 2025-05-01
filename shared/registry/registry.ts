/**
 * A generic registry class for storing and retrieving items using unique string keys.
 * It ensures that each key maps to only one item. An optional callback can be
 * provided to execute logic whenever a new item is successfully registered.
 *
 * @template T The type of items that will be stored in the registry.
 */
export class Registry<T> {
  /** @internal The internal map storing the registered items. */
  readonly #items: Map<string, T> = new Map();
  /** @internal An optional callback function triggered upon successful registration. */
  readonly #registerCallback?: (key: string, item: T) => void;

  /**
   * Creates an instance of the Registry.
   * @param {(key: string, item: T) => void} [register] - An optional callback function
   *   that gets invoked with the key and item whenever a new item is successfully
   *   added to the registry.
   */
  constructor(register?: (key: string, item: T) => void) {
    // Assign the provided callback, defaulting to undefined if none is given.
    this.#registerCallback = register;
  }

  /**
   * Registers an item with the given key.
   * If the key already exists in the registry, the operation is skipped,
   * and the existing item is maintained. If the key is new, the item is added,
   * and the optional registration callback is invoked.
   *
   * @param {string} key - The unique key to associate with the item.
   * @param {T} item - The item to store in the registry.
   * @returns {void}
   */
  public register(key: string, item: T): void {
    // Prevent overwriting existing entries.
    if (this.#items.has(key)) {
      return;
    }

    // Add the new item to the map.
    this.#items.set(key, item);

    // Invoke the callback if it was provided during construction.
    this.#registerCallback?.(key, item);
  }

  /**
   * Checks if an item is registered under the given key.
   *
   * @param {string} key - The key to check for existence.
   * @returns {boolean} `true` if the key exists in the registry, `false` otherwise.
   */
  public has(key: string): boolean {
    return this.#items.has(key);
  }

  /**
   * Retrieves the item associated with the given key.
   *
   * @param {string} key - The key of the item to retrieve.
   * @returns {T | undefined} The item associated with the key, or `undefined`
   *   if the key does not exist in the registry.
   */
  public get(key: string): T | undefined {
    return this.#items.get(key);
  }
}
