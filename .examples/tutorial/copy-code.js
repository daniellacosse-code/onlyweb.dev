import { html, registerElement } from "@onlyweb/frontend";

registerElement("copy-code", {
  attributes: { ["copy-message"]: String, code: String },
  mount: () => {
    this.addEventListener("click", () => {
      if (this.attributes.copied) {
        return;
      }

      globalThis.navigator.clipboard.writeText(this.attributes.code);

      this.querySelector("div[popover]").togglePopover();
    });
  },
  render: ({ code, ["copy-message"]: copyMessage }) =>
    html`
    <style>
      div {
        display: relative;
      }
      code {
        font-family: monospace;
        font-size: 1rem;
        text-overflow: ellipsis;
      }
      div[popover] {
        display: absolute;
        top: 0;
        left: 0;
      }
    </style>
    <div>
      <code>${code}</code>
      <div popover>${copyMessage}</div>
    </div>
  `,
});
