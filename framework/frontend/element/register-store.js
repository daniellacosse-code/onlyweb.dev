import { Register } from "./register.js";

export function RegisterStore({
  state = {},
  listensFor = [],
  handleMount = () => {},
  handleUnmount = () => {},
  handleEvent = () => {},
  ...parameters
}) {
  const handleEventWrapper = (event) => {
    event.stopPropagation();
    event.preventDefault();
    event.cancelBubble = true;

    handleEvent(event);
  };

  Register({
    handleMount: () => {
      for (const event of listensFor)
        this.addEventListener(event, handleEventWrapper);

      this.state = new Proxy(state, {
        set: (target, key, value) => {
          target[key] = Object.freeze(value);
          this.handleRender(this.state);
          return true;
        }
      });

      handleMount();
    },
    handleEvent: handleEventWrapper,
    handleUnmount: () => {
      for (const event of listensFor)
        this.removeEventListener(event, handleEventWrapper);

      handleUnmount();
    },
    ...parameters
  });
}
