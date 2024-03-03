import FrontendElement from "/framework/frontend-element/entry.js";

FrontendElement.Register("core-text", {
  templateAttributes: {
    kind: String
  },
  handleTemplateBuild({ kind = "paragraph" }) {
    return FrontendElement.html`<style>
        :host {
          cursor: inherit;
          user-select: inherit;
          font-family: system-ui;
          font-weight: ${kind === "title" ? "bold" : "normal"};
          font-size: var(--size-text-${kind});
          color: var(--color-${kind === "subtitle" ? "neutral" : "foreground"});
          line-height: 1;
        }
      </style>
      <slot></slot>`;
  }
});
