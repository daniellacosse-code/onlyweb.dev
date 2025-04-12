const sharedStyles = $Frontend.Element.html`<style>
  button {
    width: 100%;
    height: 100%;
  }

  button {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    text-align: center;
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
    transition: background var(--animation-duration)
      var(--animation-timing-function);
  }

  slot {
    --color-foreground: var(--color-background);

    color: var(--color-background);
    pointer-events: none;
    transition: color var(--animation-duration) var(--animation-timing-function);
  }
</style>`;

$Frontend.Element.Register("core-button", {
  buildAttributes: {
    disabled: Boolean
  },
  handleBuild({ disabled }) {
    if (disabled)
      return $Frontend.Element.html`${sharedStyles}
          <style>
            button {
              cursor: not-allowed;
              opacity: 0.5;
            }
          </style>
          <button disabled>
            <slot></slot>
          </button>`;

    return $Frontend.Element.html`${sharedStyles}
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
