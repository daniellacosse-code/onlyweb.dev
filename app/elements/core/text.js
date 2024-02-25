import * as FrontendElement from "/framework/frontend-element/main.js";

FrontendElement.Register({
  tag: "core-text",
  attributes: {
    kind: String
  },
  handleRender({ kind = "paragraph" }) {
    return FrontendElement.html`<style>
      :host, span {
        cursor: inherit;
        user-select: inherit;
      }

      span {
        font-family: system-ui;
        font-weight: ${kind === "title" ? "bold" : "normal"};
        font-size: var(--size-text-${kind});
        color: var(--color-${kind === "subtitle" ? "neutral" : "foreground"});
        line-height: 1;
      }

      ::selection {
        background-color: var(--color-highlight);
        color: var(--color-background);
      }
    </style>
    <span>${this.textContent}</span>`;
  }
});
