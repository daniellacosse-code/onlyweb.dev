import FrontendElement from "/framework/frontend-element/entry.js";

FrontendElement.Register("core-text", {
  templateAttributes: {
    type: String
  },
  handleTemplateBuild({ type = "paragraph" }) {
    return FrontendElement.html`<style>
        :host {
          cursor: inherit;
          user-select: inherit;
          font-family: system-ui;
          font-weight: ${type === "title" ? "bold" : "normal"};
          font-size: var(--size-text-${type});
          color: var(--color-${type === "subtitle" ? "neutral" : "foreground"});
          line-height: 1;
        }
      </style>
      <slot></slot>`;
  }
});
