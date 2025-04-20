import { html, registerElement } from "@onlyweb/frontend";

registerElement("core-text", {
  buildAttributes: {
    type: String,
  },
  handleBuild({ type = "paragraph" }) {
    return html`<style>
        slot {
          cursor: inherit;
          font-family: system-ui;
          font-weight: ${type === "title" ? "bold" : "normal"};
          font-size: var(--core-text-size-${type as string});
          color: var(--core-text-color-${type as string});
          line-height: 1;
          user-select: text;
        }
      </style>
      <slot></slot>`;
  },
});
