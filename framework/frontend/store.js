/**
 * @example
 * const store = new CustomStore({
 *  initialState: { count: 0 },
 *  events: "counter",
 *  handleEvent(event) {
 *    if (event.type === "increment") this.state.count++;
 *  },
 *  handleStateChange({ count }) {
 *    document.proxySelector("#count").textContent = count;
 *  }
 * });
 */
export class CustomStore {
  constructor({
    initialState,
    handleEvent,
    events = "global",
    handleStateChange
  }) {
    this.handleEvent = handleEvent.bind(this);
    this.handleStateChange = handleStateChange.bind(this);

    this.state = new Proxy(initialState, {
      set: (state, key, value) =>
        this.#stateProxyHandlerFactory(() => (state[key] = value)),
      deleteProperty: (state, key) =>
        this.#stateProxyHandlerFactory(() => delete state[key])
    });

    this.events = new BroadcastChannel(events);
    this.events.onmessage = (event) => {
      this.handleEvent(event);
    };
  }

  #stateProxyHandlerFactory(func) {
    func();
    this.handleStateChange(this.state);
    return true;
  }
}
