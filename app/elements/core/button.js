import * as Element from "/framework/element/main.js";

const sharedStyles = Element.html`<style>
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

Element.Register({
  tag: "core-button",
  attributes: {
    disabled: Boolean
  },
  handleRender({ disabled }) {
    if (disabled)
      return Element.html`${sharedStyles}
        <style>
          button {
            cursor: not-allowed;
            opacity: 0.5;
          }
        </style>
        <button disabled>
          <slot></slot>
        </button>`;

    return Element.html`${sharedStyles}
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
