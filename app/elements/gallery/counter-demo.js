import Frontend from "/framework/frontend/module.js";

Frontend.Element.Register("counter-demo", {
  handleMount() {
    this.template = this.attachShadow({ mode: "open" });
    this.host = this;
    this.state ??= {};

    this.addEventListener("click", ({ target }) => {
      const currentState = this.state[target.getAttribute("id")] || 0;

      this.state[target.getAttribute("id")] = currentState + 1;

      for (const [key, value] of Object.entries(this.state)) {
        console.log({ key, value }, this.state);

        const target = this.host.querySelector(`#${key}`);

        if (target) target.textContent = value;
      }
    });
  }
});
