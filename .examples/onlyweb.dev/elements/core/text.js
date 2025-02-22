$Frontend.Element.Register("core-text", {
  buildAttributes: {
    type: String
  },
  handleBuild({ type = "paragraph" }) {
    return $Frontend.Element.html`<style>
        slot {
          cursor: inherit;
          font-family: system-ui;
          font-weight: ${type === "title" ? "bold" : "normal"};
          font-size: var(--core-text-size-${type});
          color: var(--core-text-color-${type});
          line-height: 1;
          user-select: text;
        }
      </style>
      <slot></slot>`;
  }
});
