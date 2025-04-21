import { registerElement } from "@onlyweb/frontend";

registerElement<
  Record<string | number | symbol, never>,
  { state?: Record<string, number> }
>("counter-demo", {
  handleMount() {
    this.addEventListener("click", ({ target }: Event) => {
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
