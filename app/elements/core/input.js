import Frontend from "/framework/frontend/module.js";

const sharedStyles = Frontend.Element.html`<style>
  ::selection {
    background-color: var(--color-highlight);
    color: var(--color-background);
  }
  :host,
  label,
  input,
  [contenteditable="true"] {
    box-sizing: border-box;
    min-height: 100%;
    width: 100%;
    word-wrap: break-word;
  }
  :host,
  input,
  [contenteditable="true"] {
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
    cursor: text;
    position: relative;
    transition: border-color var(--animation-duration-fast) var(--animation-timing-function);
  }
  :host(:focus-within),
  :host(:active) {
    border-color: var(--color-highlight);
  }
  [contenteditable="true"], input {
    color: var(--color-foreground);
  }
  label {
    color: var(--color-neutral);
    left: 0;
    opacity: 1;
    position: absolute;
    top: 0;
    transition: opacity var(--animation-duration-fast) var(--animation-timing-function);
    z-index: -1;
    text-overflow: ellipsis;
    overflow: hidden;
    white-space: nowrap;
  }
</style>`;

Frontend.Element.Register("core-input", {
  host: {
    handleMount() {
      this.setAttribute("tabIndex", 0);
      this.setAttribute("role", "input");

      this.addEventListener("focus", () =>
        this.template.getElementById(this.__inputID__).focus()
      );

      this.addEventListener("input", ({ target }) => {
        const hasValue =
          target.localName === "input" ? target.value : target.textContent;

        this.template
          .querySelector("label")
          .classList.toggle("hidden", hasValue);
      });
    }
  },
  template: {
    attributes: {
      label: String,
      type: String
    },
    handleUpdate({ label = "", type = "content" }) {
      const __inputID__ = label.toLowerCase().replace(/\s/g, "-");

      let inputElement;

      switch (type) {
        case "text":
        case "password":
        case "email":
          inputElement = Frontend.Element
            .html`<input id="${__inputID__}" type="${type}">`;
          break;
        case "content":
        default:
          inputElement = Frontend.Element.html`
            <style>
              b, i, u { color: var(--color-foreground); }
              b { font-weight: bold; }
              i { font-style: italic; }
              u { text-decoration: underline; }
            </style>
            <div id="${__inputID__}" contenteditable="true"></div>`;
      }

      return Frontend.Element.html`
        ${sharedStyles}
        <label for="${__inputID__}">${label}</label>
        ${inputElement}`;
    }
  }
});
