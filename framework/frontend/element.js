import { makeCUID } from "../shared/cuid.js";
import { html } from "./html.js";

export function DefineElement({
  tag = "custom-element",
  attributes = {},
  render = () => new Error("No render function provided.")
}) {
  customElements.define(
    tag,
    class extends HTMLElement {
      // constructor analogous
      connectedCallback() {
        this.root = this.attachShadow({ mode: "open" });
        this.attributes.id = makeCUID();
        this.events = {
          local: new BroadcastChannel(this.attributes.id),
          global: new BroadcastChannel("global")
        };

        this.#executeRender();
      }

      // read-side: attributes
      static observedAttributes = [...Object.keys(attributes), "id"];

      get attributes() {
        return new Proxy(
          {},
          {
            deleteProperty: (_, attribute) => this.removeAttribute(attribute),
            get: (_, attribute) =>
              (attributes[attribute] ?? String)(this.getAttribute(attribute)),
            set: (_, attribute, value) =>
              this.setAttribute(attribute, String(value)) || true
          }
        );
      }

      attributeChangedCallback = this.#executeRender;

      #executeRender() {
        if (!this.root) return;

        this.root.replaceChildren(
          html`<template>
            <style>
              * {
                all: initial;
              }
              style,
              script {
                display: none;
              }
            </style>
            ${render(this.attributes)}
          </template>`
        );

        this.root.append(
          this.root.querySelector("template").content.cloneNode(true)
        );
      }

      // write-side: events
      dispatchEvent({ type = "custom", detail }) {
        const payload = { type, detail, target: this };

        for (const id in this.events) {
          channel[id].postMessage(payload);
        }

        return super.dispatchEvent(
          new CustomEvent(type, { bubbles: true, detail })
        );
      }

      disconnectedCallback() {
        for (const id in this.events) {
          channel[id].close();
        }
      }
    }
  );
}
