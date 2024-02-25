import * as FrontendElement from "/framework/frontend-element/main.js";

FrontendElement.Register({
  tag: "core-input",
  attributes: {
    label: String,
    type: String,
    value: String
  },
  handleMount() {
    this.addEventListener("input", ({ target }) => {
      this.attributes.value = target.textContent;
    });
  },
  handleRender({ label = "", value = "" }) {
    return FrontendElement.html`<style>
      :host, label, .container, #input {
        width: 100%;
        height: 100%;
      }
      :host, .container {
        display: inline-block;
      }
      .container {
        position: relative;
      }
      label, #input{
        position: absolute;
        top: 0;
        left: 0;
        padding: var(--size-narrow);
      }
      label {
        color: var(--color-neutral);
        padding: calc(var(--size-narrow) + 3px);
        opacity: 1;
        transition: opacity 140ms var(--animation-timing-function);
      }
      label.hidden,
      .container:focus-within label {
        opacity: 0;
      }
      #input {
        border: 3px solid var(--color-foreground);
        border-radius: var(--size-narrow);
        color: var(--color-foreground);
        transition: border-color 140ms var(--animation-timing-function);
        background: transparent;
      }
      #input:focus,
      #input:active {
        border-color: var(--color-highlight);
      }
    </style>
    <div class="container">
      <label for="input" class="${Boolean(value) && "hidden"}">${label}</label>
      <div id="input" role="input" contenteditable>
        <slot></slot>
      </div>
    </div>`;
  }
});
