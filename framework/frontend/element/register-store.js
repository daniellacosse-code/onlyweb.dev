import { Register } from "./register.js";

export function RegisterStore({
  state = {},
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
    handleMount: (_, self) => {
      self.state = new Proxy(state, {
        set: (target, key, value) => {
          target[key] = Object.freeze(value);
          self.EXECUTE_RENDER();
          return true;
        }
      });
    },
    handleRender: ({ ["listens-for"]: listensFor }) => {
      for (const event of listensFor.split(" "))
        self.addEventListener(event, handleEventWrapper);

      return Frontend.Element.html`<slot></slot>`;
    },
    handleEvent: handleEventWrapper,
    handleUnmount: ({ ["listens-for"]: listensFor }) => {
      for (const event of listensFor)
        self.removeEventListener(event, handleEventWrapper);
    },
    ...parameters
  });
}
