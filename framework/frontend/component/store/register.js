export function RegisterStore({
  tag = "custom-store",
  listensFor = new Set(),
  state = {},
  handleMount = () => {},
  handleEvent = () => {},
  handleChange = () => {}
}) {
  globalThis.customStores ??= new Map();

  if (globalThis.customStores.get(tag)) {
    return console.warn(`Store ${tag} already defined.`);
  }

  switch (typeof listensFor) {
    case "string":
      listensFor = new Set([listensFor]);
      break;
    case "object":
      if (listensFor instanceof Array) {
        listensFor = new Set(listensFor);
      }
      break;
  }

  const Store = class {
    #channels = Array.from(listensFor).map(
      (channel) => new BroadcastChannel(channel)
    );
    #handleChange = null;
    #handleEvent = null;
    #handleMount = null;
    constructor() {
      this.#handleChange = handleChange.bind(this);
      this.#handleEvent = handleEvent.bind(this);
      this.#handleMount = handleMount.bind(this);

      this.state = new Proxy(state, {
        set: (target, key, value) => {
          target[key] = Object.freeze(value);
          this.#handleChange(this.state);
          return true;
        }
      });

      for (const channel of this.#channels) {
        channel.onmessage = ({ data: { __targetID, type, detail } }) => {
          const target = document.querySelector(__targetID);

          if (!target)
            return console.warn(
              `No target found for element of ID "${__targetID}". Try setting an explicit ID on elements with state-based behavior.`
            );

          this.#handleEvent({ type, detail, target });
        };
      }

      this.#handleMount(state);
    }
  };

  globalThis.customStores.set(tag, new Store());

  return globalThis.customStores.get(tag);
}
