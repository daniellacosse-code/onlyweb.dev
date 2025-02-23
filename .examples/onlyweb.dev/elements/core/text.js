export class CoreText extends $Frontend.Element {
  tag = "core-text";

  attributes = {
    type: String,
  };

  render({ attributes: { type = "paragraph" }, _: { html } }) {
    return html`
      <style>
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
      <slot></slot>
  `;
  }
}
