import * as FrontendElement from "/framework/frontend-element/main.js";

FrontendElement.Register({
  tag: "core-text",
  attributes: {
    type: String
  },
  handleRender({ type = "p" }) {
    return FrontendElement.html`<style>
      :host {
        display: inline;
      }

      :host slot {
        font-family: system-ui;
        font-size: var(--size-text-${type});
        color: var(--color-foreground);

      }
    </style>
    <slot></slot>`;
  }
});
