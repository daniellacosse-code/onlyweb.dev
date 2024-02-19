import { DefineElement } from "../../../framework/frontend/element.js";
import { html } from "../../../framework/frontend/html.js";

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
    transition: background-color 0.2s ease-in-out;
  }
</style>`;

DefineElement({
  tag: "core-button",
  attributes: {
    disabled: Boolean,
    click: String
  },
  handleRender({ disabled, click }) {
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
        button:hover {
          background-color: hsl(0, 0%, 95%);
        }
        button:active {
          background-color: hsl(0, 0%, 90%);
        }
      </style>
      <button
        onclick="event.preventDefault(); this.dispatchEvent(new CustomEvent('${click}'))"
      >
        <slot></slot>
      </button>`;
  }
});
