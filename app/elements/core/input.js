import FrontendElement from "/framework/frontend-element/entry.js";

FrontendElement.Register("core-input", {
  attributes: {
    label: String,
    ["has-value"]: Boolean
  },
  handleMount() {
    this.attributes.contenteditable = true;
    this.attributes["has-value"] = Boolean(this.textContent);

    this.addEventListener("input", () => {
      this.attributes["has-value"] = Boolean(this.textContent);
    });
  },
  handleRender({ label = "" }) {
    return FrontendElement.html`<style>
      :host, label {
        box-sizing: border-box;
        display: inline-block;
        width: 100%;
        min-height: 100%;
      }
      :host {
        position: relative;
        border: 3px solid var(--color-foreground);
        border-radius: var(--size-narrow);
        color: var(--color-foreground);
        transition: border-color 140ms var(--animation-timing-function);
        background: transparent;
        padding: var(--size-narrow);
        outline: 0;
      }
      label {
        position: absolute;
        top: 0;
        left: 0;
        color: var(--color-neutral);
        padding: var(--size-narrow);
        opacity: 1;
        transition: opacity 140ms var(--animation-timing-function);
        z-index: -1;
      }
      label.hidden,
      :host(:focus) label {
        opacity: 0;
      }
      :host(:focus),
      :host(:active) {
        border-color: var(--color-highlight);
      }
      ::selection {
        background-color: var(--color-highlight);
        color: var(--color-background);
      }
    </style>
    <label class="${this.attributes["has-value"] && "hidden"}">${label}</label>
    <slot></slot>`;
  }
});
