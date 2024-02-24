import * as Frontend from "/framework/frontend/main.js";

import "/app/elements/core/button.js";

Frontend.Element.Register({
  tag: "counter-demo",
  attributes: {
    // state: JSON
    count: Number
  },
  handleMount() {
    this.abortController = new AbortController();

    this.addEventListener(
      "click",
      (event) => {
        event.stopPropagation();
        const target = event.composedPath().find((el) => el.attributes?.id);
        if (!target) return;

        this.attributes.count = Number(target.textContent) + 1;
      },
      {
        signal: this.abortController.signal
      }
    );
  },
  handleRender({ count = 0 }) {
    return Frontend.Element.html`
      <core-button id="counter-1">${count}</core-button>
    `;
  },
  handleUnmount() {
    this.abortController.abort();
  }
});
