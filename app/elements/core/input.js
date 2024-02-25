import * as FrontendElement from "/framework/frontend-element/main.js";

FrontendElement.Register({
  tag: "core-input",
  attributes: {
    label: String,
    type: String
  },
  handleRender({ label = "", type = "text" }) {
    return FrontendElement.html`<style>
      :host {
        display: inline-block;
        width: 100%;
        height: 100%;
      }
      .input {
        display: flex;
        align-items: center;
        border: 5px solid var(--color-foreground);
        color: var(--color-foreground);
        width: 100%;
        height: 100%;
        transition: border-color var(--animation-duration) var(--animation-timing-function);
        border-radius: var(--size-narrow);
        padding: var(--size-narrow);
        background: transparent;
      }
      .input:focus,
      .input:active {
        border-color: var(--color-highlight);
      }
    </style>
    <div class="input" contenteditable>${label}</div>`;
  }
});
