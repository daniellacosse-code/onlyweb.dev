import FrontendElement from "/framework/frontend-element/entry.js";

const sharedStyles = FrontendElement.html`<style>
  ::selection {
    background-color: var(--color-highlight);
    color: var(--color-background);
  }
  :host,
  label,
  [role="input"] {
    box-sizing: border-box;
    min-height: 100%;
    width: 100%;
    word-wrap: break-word;
  }
  :host,
  [role="input"] {
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
  [role="input"] {
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
  }
</style>`;

FrontendElement.Register("core-input", {
  attributes: {
    label: String,
    type: String,
    value: String
  },
  handleMount() {
    this.root = this.attachShadow({ mode: "open" });
    this.labelID = this.attributes.label.toLowerCase().replace(/\s/g, "-");

    this.attributes.tabindex = 0;
    this.attributes.role = "input";

    this.addEventListener("focus", () =>
      this.querySelector(`#${this.labelID}`).focus()
    );
    this.addEventListener("input", ({ target }) => {
      this.attributes.value =
        target.tag === "input" ? target.value : target.textContent;
    });
  },
  handleRender({ label = "", value = "", type = "content" }) {
    let inputElement;

    switch (type) {
      case "text":
      case "password":
      case "email":
        inputElement = FrontendElement.html`<input id="${this.labelID}" type="${type}" value="${value}">`;
        break;
      case "content":
      default:
        inputElement = FrontendElement.html`
          <style>
            b, i, u { color: var(--color-foreground); }
            b { font-weight: bold; }
            i { font-style: italic; }
            u { text-decoration: underline; }
          </style>
          <div id="${this.labelID}" role="input" contenteditable="true">${value}</div>`;
    }

    return FrontendElement.html`
      ${sharedStyles}
      <label for="${this.labelID}" class="${
      this.attributes.value && "hidden"
    }">${label}</label>
      ${inputElement}`;
  }
});
