import { type AnyPrimitiveShape, registerElement } from "@onlyweb/frontend";

type CounterDemoState = {
  state?: Record<string, number>;
};

registerElement<AnyPrimitiveShape, CounterDemoState>("counter-demo", {
  mount() {
    this.addEventListener("click", ({ target }: Event) => {
      if (!target) {
        return;
      }

      this.state ??= {};

      const targetID = (target as HTMLElement).getAttribute("id") ?? "";
      const currentState = this.state[targetID] || 0;

      this.state[targetID] = currentState + 1;

      for (const [key, value] of Object.entries(this.state)) {
        const target = (this.querySelector("slot") as HTMLSlotElement | null)
          ?.assignedElements()[0]
          .querySelector(`#${key}`);

        if (target) {
          (target as HTMLElement).textContent = String(value);
        }
      }
    });
  },
});
