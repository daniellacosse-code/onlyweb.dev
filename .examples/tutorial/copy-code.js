// @ts-check
/// <reference lib="dom" />

import { html, registerElement } from "@onlyweb/frontend";

registerElement("copy-code", {
  attributes: { ["copy-message"]: String, code: String },
  mount() {
    this.addEventListener("click", async () => {
      await globalThis.navigator.clipboard.writeText(
        String(this.buildAttributes.code),
      );

      this.querySelector("div[popover]")?.togglePopover();
    });
  },
  render({ code, ["copy-message"]: copyMessage }) {
    return html`
    <style>
      div {
        position: relative;
      }
      code {
        font-family: monospace;
        font-size: 1rem;
        text-overflow: ellipsis;
      }
      div[popover] {
        position: absolute;
      }
    </style>
    <div>
      <code>${String(code)}</code>
      <div popover>${String(copyMessage)}</div>
    </div>
  `;
  },
});
