import { RegisterElement } from "./register.js";

export function RegisterStore({
  state = {},
  listensFor = [],
  handleMount = () => {},
  handleUnmount = () => {},
  handleEvent = () => {},
  ...parameters
}) {
  RegisterElement({
    handleMount: () => {
      for (const event of listensFor)
        this.addEventListener(event, this.#handleEvent);

      this.state = new Proxy(state, {
        set: (target, key, value) => {
          target[key] = Object.freeze(value);
          this.handleRender(this.state);
          return true;
        }
      });

      handleMount();
    },
    handleEvent: (event) => {
      event.stopPropagation();
      event.preventDefault();
      event.cancelBubble = true;

      handleEvent(event);
    },
    handleUnmount: () => {
      for (const event of listensFor)
        this.removeEventListener(event, this.#handleEvent);

      handleUnmount();
    },
    ...parameters
  });
}
