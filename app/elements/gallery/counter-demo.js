import FrontendElement from "/framework/frontend-element/module.js";

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
  handleRender({ state = {} }) {
    for (const [key, value] of Object.entries(state)) {
      const target = this.querySelector(`#${key}`);

      if (target) target.textContent = value;
    }

    return FrontendElement.html`<style>
      div {
        display: flex;
        gap: var(--size-narrow);
      }
    </style><div><slot></slot></div>`;
  }
});
