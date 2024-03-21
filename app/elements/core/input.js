import Frontend from "/framework/frontend/module.js";

const sharedStyles = Frontend.Element.html`<style>
  ::selection {
    background-color: var(--color-highlight);
    color: var(--color-background);
  }
  label,
  input,
  [contenteditable="true"] {
    box-sizing: border-box;
    min-height: 100%;
    width: 100%;
    word-wrap: break-word;
  }
  input,
  [contenteditable="true"] {
    outline: 0;
  }
  label {
    display: inline-block;
    padding: var(--size-narrow);
  }
  label.hidden,
  .wrapper:focus > label {
    opacity: 0;
  }
  div {
    border-radius: var(--size-narrow);
    border: var(--size-hairline) solid var(--color-foreground);
    cursor: text;
    position: relative;
    transition: border-color var(--animation-duration-fast) var(--animation-timing-function);
  }
  .wrapper:focus-within,
  .wrapper:active {
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

const makeLabelID = (label) => label.toLowerCase().replace(/\s/g, "-");

Frontend.Element.Register("core-input", {
  host: {
    handleMount({ label = "" }) {
      this.setAttribute("tabIndex", 0);
      this.setAttribute("role", "input");

      const __inputID__ = makeLabelID(label);

      this.addEventListener("focus", () =>
        this.template.getElementById(__inputID__).focus()
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
    handleBuild({ label = "", type = "content" }) {
      const __inputID__ = makeLabelID(label);

      let inputElement;

      switch (type) {
        case "text":
        case "password":
        case "email":
        case "search":
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
        <div class="wrapper">
          <label for="${__inputID__}">${label}</label>
          ${inputElement}
        </div>`;
    }
  }
});
