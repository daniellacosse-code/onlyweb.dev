import { makeCUID } from "/framework/shared/cuid.js";

export function DefineState({
  id = makeCUID(),
  channel,
  initialState = {},
  handleEvent = () => {},
  handleChange = () => {}
}) {
  if (!globalThis.customStates) globalThis.customStates = {};

  const State = class {
    #channel = new BroadcastChannel(channel);
    #handleChange = null;
    #handleEvent = null;
    constructor() {
      this.#handleEvent = handleEvent.bind(this);
      this.#handleChange = handleChange.bind(this);
      this.#channel.onmessage = ({ data }) => {
        this.#handleEvent(data);
        this.#handleChange(this);
      };

      this.#handleChange(this);
    }
  };

  return (globalThis.customStates[id || channel] = new State(initialState));
}
