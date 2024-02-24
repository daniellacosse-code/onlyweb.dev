// TODO: need to revise this file
export default function DeepProxy(root, handler = {}) {
  return new Proxy(root, {
    get(target, property, receiver) {
      try {
        return new Proxy(target[property], handler);
      } catch {
        return Reflect.get(target, property, receiver);
      }
    },
    set(target, property, value, receiver) {
      try {
        Reflect.set(target[property], value, receiver);
        return handler.set?.(root, value, receiver) ?? true;
      } catch {
        Reflect.set(target, property, value, receiver);
        return handler.set?.(root, property, value, receiver) ?? true;
      }
    },
    deleteProperty(target, property) {
      try {
        return Reflect.deleteProperty(target[property]);
      } catch {
        return Reflect.deleteProperty(target, property);
      }
    }
  });
}
