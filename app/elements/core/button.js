import FrontendElement from "/framework/frontend-element/entry.js";

const sharedStyles = FrontendElement.html`<style>
  :host,
  button {
    width: 100%;
    height: 100%;
  }

  button {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    font-family: inherit;
    font-size: var(--size-text-paragraph);
    padding: var(--size-narrow) var(--size-default);
    border: none;
    border-radius: var(--size-narrow);
    cursor: pointer;
    background: linear-gradient(
      45deg,
      var(--color-highlight) 0 25%,
      var(--color-foreground) 75% 100%
    );
    background-size: 400% 200%;
    background-position: 100% 0;
    user-select: none;
    transition: background var(--animation-duration)
      var(--animation-timing-function);
  }

  slot {
    --color-foreground: var(--color-background);

    color: var(--color-background);
    transition: color var(--animation-duration) var(--animation-timing-function);
    text-align: center;
  }
</style>`;

FrontendElement.Register("core-button", {
  templateAttributes: {
    disabled: Boolean
  },
  handleTemplateUpdate({ disabled }) {
    if (disabled)
      return FrontendElement.html`${sharedStyles}
        <style>
          button {
            cursor: not-allowed;
            opacity: 0.5;
          }
        </style>
        <button disabled>
          <slot></slot>
        </button>`;

    return FrontendElement.html`${sharedStyles}
      <style>
        button:hover,
        button:active,
        button:focus {
          background-position: 0 100%;
        }
        button:focus,
        button:active {
          outline: var(--size-hairline) solid var(--color-highlight);
          outline-offset: var(--size-hairline);
        }
      </style>
      <button>
        <slot></slot>
      </button>`;
  }
});
