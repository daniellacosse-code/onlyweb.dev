import { makeCUID } from "/framework/shared/cuid.js";

export function DefineStore({
  id = makeCUID(),
  name,
  channel,
  state = {},
  handleEvent = () => {},
  handleChange = () => {}
}) {
  if (!globalThis.customStates) globalThis.customStates = {};

  const Store = class {
    #channel = new BroadcastChannel(channel);
    #handleChange = null;
    #handleEvent = null;
    constructor() {
      this.state = new Proxy(state, {
        set: (target, key, value) => {
          target[key] = Object.freeze(value);
          this.#handleChange(this.state);
          return true;
        }
      });

      this.#handleEvent = handleEvent.bind(this);
      this.#channel.onmessage = ({ data: { __targetID, type, detail } }) => {
        this.#handleEvent({
          type,
          detail,
          target: document.querySelector(__targetID)
        });
      };

      this.#handleChange = handleChange.bind(this);
      this.#handleChange(this.state);
    }
  };

  return (globalThis.customStates[name || channel || id] = new Store());
}
