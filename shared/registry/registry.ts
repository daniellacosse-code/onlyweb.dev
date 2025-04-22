/**
 * A registry for storing and retrieving items by key.
 */
export class Registry<T> {
  readonly #items: Map<string, T> = new Map();
  readonly #registerCallback?: (key: string, item: T) => void = () => {};

  constructor(register?: (key: string, item: T) => void) {
    this.#registerCallback = register;
  }

  public register(key: string, item: T): void {
    if (this.#items.has(key)) {
      return;
    }

    this.#items.set(key, item);

    this.#registerCallback?.(key, item);
  }

  public has(key: string): boolean {
    return this.#items.has(key);
  }

  public get(key: string): T | undefined {
    return this.#items.get(key);
  }
}
