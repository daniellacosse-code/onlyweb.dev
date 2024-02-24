export default function DeepProxy(root, handler = {}) {
  return new Proxy(root, {
    get(target, property, receiver) {
      let result;
      try {
        result = new Proxy(target[property], handler);
      } catch {
        result = Reflect.get(target, property, receiver);
      }

      handler.get?.(root, property);
      return result;
    },
    set(target, property, value, receiver) {
      let result;
      try {
        result = Reflect.set(target[property], value, receiver);
      } catch {
        result = Reflect.set(target, property, value, receiver);
      }

      handler.set?.(root, property, value);
      return result;
    },
    deleteProperty(target, property) {
      let result;
      try {
        result = Reflect.deleteProperty(target[property]);
      } catch {
        result = Reflect.deleteProperty(target, property);
      }

      handler.deleteProperty?.(root, property);
      return result;
    }
  });
}
