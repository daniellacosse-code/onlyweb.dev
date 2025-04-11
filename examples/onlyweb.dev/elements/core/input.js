const sharedStyles = $Frontend.Element.html`<style>
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
</style>`;

const makeLabelID = (label) => label.toLowerCase().replace(/\s/g, "-");

$Frontend.Element.Register("core-input", {
  buildAttributes: {
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
        inputElement = $Frontend.Element.html`
          <input id="${__inputID__}"
            type="${type}" 
            aria-labelledby="${__inputID__}-label" 
            role="${type}box"
          >`;
        break;

      case "content":
      default:
        inputElement = $Frontend.Element.html`
            <style>
              b, i, u { color: var(--color-foreground); }
              b { font-weight: bold; }
              i { font-style: italic; }
              u { text-decoration: underline; }
            </style>
            <div id="${__inputID__}"
              contenteditable="true"
              aria-labelledby="${__inputID__}-label" 
              role="textbox"
            ></div>`;
    }

    return $Frontend.Element.html`
        ${sharedStyles}
        <div class="wrapper">
          <label id="${__inputID__}-label">${label}</label>
          ${inputElement}
        </div>`;
  },
  handleMount({ label = "" }) {
    this.setAttribute("tabIndex", 0);

    const __inputID__ = makeLabelID(label);

    this.addEventListener("focus", () =>
      this.querySelector(`#${__inputID__}`).focus()
    );

    this.addEventListener("input", ({ target }) => {
      const value =
        target.localName === "input" ? target.value : target.textContent;
      this.value = value;
      this.querySelector("label").classList.toggle("hidden", Boolean(value));
    });
  }
});
