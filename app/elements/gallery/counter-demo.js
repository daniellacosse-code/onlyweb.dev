import FrontendElement from "/framework/frontend-element/entry.js";

FrontendElement.Register("counter-demo", {
  attributes: {
    state: JSON
  },
  handleMount() {
    this.attributes.state ??= {};

    this.addEventListener("click", ({ target }) => {
      const currentState = this.attributes.state[target.attributes.id] || 0;

      this.attributes.state[target.attributes.id] = currentState + 1;
    });
  },
  // TODO: render not being triggered here (issue with the deep proxy)
  handleRender({ state = {} }) {
    for (const [key, value] of Object.entries(state)) {
      const target = this.querySelector(`#${key}`);

      if (target) target.textContent = value;
    }
  }
});
