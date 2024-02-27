import FrontendElement from "/framework/frontend-element/entry.js";

FrontendElement.Register("core-input", {
  attributes: {
    label: String
  },
  handleMount() {
    this.attributes.contenteditable = true;
    this.hasContent = Boolean(this.textContent);

    requestAnimationFrame(() => {
      if (this.hasContent) {
        this.querySelector("label").classList.add("hidden");
      } else {
        this.querySelector("label").classList.remove("hidden");
      }
    });

    // re-rendering messes with the focus, so we
    // manage the state this way
    this.addEventListener("input", () => {
      this.hasContent = Boolean(this.textContent);

      if (!this.hasContent) {
        this.innerText = ".";
      }

      if (this.hasContent) {
        this.querySelector("label").classList.add("hidden");
      } else {
        this.querySelector("label").classList.remove("hidden");
      }
    });

    this.attributes.tabindex = 0;
    this.addEventListener("focus", () => this.querySelector("#input").focus());

    this.addEventListener("blur", () => {
      requestAnimationFrame(() => document.body.blur());
    });
  },
  handleRender({ label = "" }) {
    return FrontendElement.html`<style>
        ::selection {
          background-color: var(--color-highlight);
          color: var(--color-background);
        }
        :host,
        label,
        #input {
          box-sizing: border-box;
          min-height: 100%;
          width: 100%;
          word-wrap: break-word;
        }
        :host,
        #input {
          outline: 0;
        }
        :host,
        label {
          display: inline-block;
          padding: var(--size-narrow);
        }
        label.hidden,
        :host(:focus) > label {
          opacity: 0;
        }
        :host {
          border-radius: var(--size-narrow);
          border: var(--size-hairline) solid var(--color-foreground);
          position: relative;
          transition: border-color var(--animation-duration-fast) var(--animation-timing-function);
        }
        :host(:focus-within),
        :host(:active) {
          border-color: var(--color-highlight);
        }
        #input, b, i, u {
          color: var(--color-foreground);
        }
        b {
          font-weight: bold;
        }
        i {
          font-style: italic;
        }
        u {
          text-decoration: underline;
        }
        label {
          color: var(--color-neutral);
          left: 0;
          opacity: 1;
          position: absolute;
          top: 0;
          transition: opacity var(--animation-duration-fast) var(--animation-timing-function);
          z-index: -1;
        }

      </style>
      <label for="input">${label}</label>
      <slot role="input" id="input"></slot>`;
  }
});
