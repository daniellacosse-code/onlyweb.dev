import { DefineElement } from "/framework/frontend/element.js";
import { html } from "/framework/frontend/html.js";

const sharedStyles = html`<style>
  button {
    display: inline-block;
    font-family: inherit;
    font-size: 1rem;
    padding: 0.5rem 1rem;
    border: none;
    border-radius: 0.5rem;
    cursor: pointer;
    background-color: hsl(0, 0%, 100%);
    color: hsl(0, 0%, 0%);
    user-select: none;
  }
</style>`;

DefineElement({
  tag: "core-button",
  attributes: {
    disabled: Boolean,
    click: String
  },
  handleMount({ click }) {
    this.host.addEventListener("click", () =>
      this.dispatchEvent(new CustomEvent(click))
    );
  },
  handleRender({ disabled }) {
    if (disabled)
      return html`${sharedStyles}
        <style>
          button {
            cursor: not-allowed;
            opacity: 0.5;
          }
        </style>
        <button disabled>
          <slot></slot>
        </button>`;

    return html`${sharedStyles}
      <style>
        button:hover,
        button:active {
          background-color: hsl(0, 0%, 0%);
        }
        button:hover > slot,
        button:active > slot {
          color: hsl(0, 0%, 100%);
        }
      </style>
      <button>
        <slot></slot>
      </button>`;
  }
});
