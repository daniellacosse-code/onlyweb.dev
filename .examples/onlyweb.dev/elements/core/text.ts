import {
  type ConvertConstructorShapeToPrimitiveShape as $,
  html,
  registerElement,
} from "@onlyweb/frontend";

const attributes = {
  type: String,
};

registerElement<$<typeof attributes>>("core-text", {
  attributes,
  render({ type = "paragraph" }) {
    return html`<style>
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
  },
});
