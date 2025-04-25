// @ts-check
/// <reference lib="dom" />

import { html, registerElement } from "@onlyweb/frontend";

registerElement("copy-code", {
  attributes: { ["copy-message"]: String, code: String },
  mount() {
    this.querySelector("#copy-message-popover")?.hidePopover();

    this.addEventListener("click", async () => {
      await globalThis.navigator.clipboard.writeText(
        String(this.buildAttributes.code),
      );

      this.querySelector("#copy-message-popover")?.showPopover();
    });
  },
  render({ code, ["copy-message"]: copyMessage }) {
    return html`
    <style>
      code {
        font-family: monospace;
        font-size: 1rem;
        text-overflow: ellipsis;
      }
      div[popover] {
        all: revert;
      }
    </style>
    <button popovertarget="copy-message-popover">
      <code>${String(code)}</code>
    </button>
    <div id="copy-message-popover" popover>${String(copyMessage)}</div>
  `;
  },
});
