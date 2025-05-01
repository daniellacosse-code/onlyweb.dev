import { registerElement } from "@onlyweb/frontend";

registerElement("counter-demo", {
  mount() {
    this.addEventListener("click", ({ target }) => {
      if (!target) {
        return;
      }

      this.state ??= {};

      const targetID = target.getAttribute("id") ?? "";
      const currentState = this.state[targetID] || 0;

      this.state[targetID] = currentState + 1;

      for (const [key, value] of Object.entries(this.state)) {
        const target = this.querySelector("slot")
          ?.assignedElements()[0]
          .querySelector(`#${key}`);

        if (target) {
          target.textContent = String(value);
        }
      }
    });
  },
});
