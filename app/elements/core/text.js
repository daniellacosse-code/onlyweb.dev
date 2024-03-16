import Frontend from "/framework/frontend/module.js";

Frontend.Element.Register("core-text", {
  template: {
    attributes: {
      type: String
    },
    handleBuild({ type = "paragraph" }) {
      return Frontend.Element.html`<style>
          :host {
            cursor: inherit;
            user-select: inherit;
            font-family: system-ui;
            font-weight: ${type === "title" ? "bold" : "normal"};
            font-size: var(--size-text-${type});
            color: var(--color-${
              type === "subtitle" ? "neutral" : "foreground"
            });
            line-height: 1;
          }
        </style>
        <slot></slot>`;
    }
  }
});
