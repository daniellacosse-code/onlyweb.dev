import * as Frontend from "/framework/frontend/main.js";

import "/app/elements/core/button.js";

Frontend.Element.Register({
  tag: "counter-demo",
  attributes: {
    state: JSON
  },
  handleMount() {
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
  }
});
