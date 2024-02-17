export function DefineStore(
  events,
  { initialState = {}, handleEvent = () => {}, handleChange = () => {} }
) {
  // we can't use a private class field here because need it in the proxy -
  // a closure is the only way to keep this private
  const stateProxyHandlerFactory = (state, handleOperation) => {
    handleOperation();
    handleChange(state);
    return true;
  };

  const Store = class {
    #events = new BroadcastChannel(events);
    constructor(initialState) {
      for (const key in initialState) this[key] = initialState[key];
      this.#events.onmessage = (event) => handleEvent(event);
      handleChange(this);
    }
  };

  return new Proxy(new Store(initialState), {
    set: (state, key, value) =>
      stateProxyHandlerFactory(this, () => (state[key] = value)),
    deleteProperty: (state, key) =>
      stateProxyHandlerFactory(this, () => delete state[key])
  });
}
