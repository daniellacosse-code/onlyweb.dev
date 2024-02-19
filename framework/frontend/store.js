export function DefineStore({
  events,
  initialState = {},
  handleEvent = () => {},
  handleChange = () => {}
}) {
  if (!globalThis.customStores) globalThis.customStores = {};

  // we can't use a private class field here because need this method in the proxy -
  // a closure is the only way to keep it private
  const stateProxyHandlerFactory = (state, handleOperation) => {
    handleOperation();
    handleChange(state);
    return true;
  };

  const Store = class {
    #events = new BroadcastChannel(events);
    constructor(initialState) {
      this.handleEvent = handleEvent.bind(this);
      this.handleChange = handleChange.bind(this);

      for (const key in initialState) this[key] = initialState[key];
      this.#events.onmessage = (event) => this.handleEvent(event);
      this.handleChange(this.state);
    }
  };

  return (globalThis.customStores[events] = new Proxy(new Store(initialState), {
    set: (state, key, value) =>
      stateProxyHandlerFactory(this, () => (state[key] = value)),
    deleteProperty: (state, key) =>
      stateProxyHandlerFactory(this, () => delete state[key])
  }));
}
