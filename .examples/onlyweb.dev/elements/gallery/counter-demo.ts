import { registerElement } from "@onlyweb/frontend";

interface CounterState {
  [key: string]: number;
}

interface CounterDemoElement extends HTMLElement {
  state?: CounterState;
}

registerElement("counter-demo", {
  handleMount(this: CounterDemoElement) {
    this.addEventListener("click", ({ target }) => {
      if (!target) {
        return;
      }

      this.state ??= {};

      const targetID = (target as HTMLElement).getAttribute("id") ?? "";
      const currentState = this.state[targetID] || 0;

      this.state[targetID] = currentState + 1;

      for (const [key, value] of Object.entries(this.state)) {
        const target = this.querySelector(`#${key}`);

        if (target) (target as HTMLElement).textContent = String(value);
      }
    });
  },
});
