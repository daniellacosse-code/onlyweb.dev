import { makeCUID } from "/framework/shared/cuid.js";

export function DefineStore({
  id = makeCUID(),
  listensFor = new Set(),
  state = {},
  handleMount = () => {},
  handleEvent = () => {},
  handleChange = () => {}
}) {
  if (!globalThis.customStores) globalThis.customStores = {};

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
          this.#handleEvent({
            type,
            detail,
            target: document.querySelector(__targetID)
          });
        };
      }

      this.#handleMount(state);
    }
  };

  return (globalThis.customStores[id] = new Store());
}
