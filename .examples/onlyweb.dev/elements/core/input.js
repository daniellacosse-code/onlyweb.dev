export class CoreInput extends $Frontend.Element {
  tag = "core-input";

  attributes = {
    label: String,
    type: String,
    value: String,
    tabIndex: 0,
  };

  selectors = {
    input: "#input",
  };

  focus({ selectors: { input } }) {
    input.focus();
  }

  input({ event: { target: { localName, value, textContent } } }) {
    const unwrappedValue = localName === "input" ? value : textContent;

    return { attributes: { value: unwrappedValue } };
  }

  render(world) {
    const {
      attributes: { label, value },
      _: { html },
    } = world;

    return html`
      <style>
        .wrapper,
        input,
        [contenteditable="true"],
        label {
          display: inline-block;
          font-family: system-ui;
          min-height: 100%;
          width: 100%;
          outline: 0;
        }
        ::selection {
          background-color: var(--color-highlight);
          color: var(--color-background);
        }
        .wrapper {
          border-radius: var(--size-narrow);
          border: var(--size-hairline) solid var(--color-foreground);
          padding: var(--size-narrow);
          cursor: text;
          position: relative;
          transition: border-color var(--animation-duration-fast) var(--animation-timing-function);
        }
        .wrapper:focus-within,
        .wrapper:active {
          border-color: var(--color-highlight);
        }
        label {
          color: var(--color-neutral);
          display: inline-block;
          left: 0;
          opacity: 1;
          overflow: hidden;
          padding: var(--size-narrow);
          position: absolute;
          text-overflow: ellipsis;
          top: 0;
          transition: opacity var(--animation-duration-fast) var(--animation-timing-function);
          white-space: nowrap;
          z-index: -1;
        }
        label.hidden,
        .wrapper:focus-within > label {
          opacity: 0;
        }
        input,
        [contenteditable="true"] {
          word-wrap: break-word;
          color: var(--color-foreground);
        }
        b, i, u { color: var(--color-foreground); }
              b { font-weight: bold; }
              i { font-style: italic; }
              u { text-decoration: underline; }
      </style>
      <div class="wrapper">
        <label for="input" class="${value ? "hidden" : ""}">${label}</label>
        ${this.#renderInput(world)}
      </div>
    `;
  }

  #renderInput({ attributes: { type = "content" }, _: { html } }) {
    switch (type) {
      case "text":
      case "password":
      case "email":
      case "search":
        return html`<input id="input" type="${type}"></input>`;
      case "content":
      default:
        return html`<div id="input" contenteditable="true" role="textbox"></div>`;
    }
  }
}
