import { makeCUID } from "/framework/shared/cuid.js";
import { html } from "./html.js";

export function DefineElement({
  tag = "custom-element",
  attributes = {},
  handleMount = () => {},
  handleRender = () => new Error("No render handler provided.")
}) {
  globalThis.customElements.define(
    tag,
    class extends HTMLElement {
      #handleRender;
      #handleMount;
      // constructor analogous
      connectedCallback() {
        this.root = this.attachShadow({ mode: "open" });
        this.attributes.id ??= makeCUID();

        if (this.attributes.channel)
          this.channel = new BroadcastChannel(this.attributes.channel);

        this.#handleRender = handleRender.bind(this);
        this.#executeRender();

        this.#handleMount = handleMount.bind(this);
        this.#handleMount(this.attributes);
      }

      // read-side: attributes
      static observedAttributes = ["id", "channel", ...Object.keys(attributes)];
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

      attributeChangedCallback() {
        this.#executeRender();
      }

      #executeRender() {
        if (!this.root) return;

        const renderResult = html`<template>
          <style>
            * {
              all: initial;
            }
            style,
            script {
              display: none;
            }
            slot {
              cursor: inherit;
            }
          </style>
          ${this.#handleRender(this.attributes)}
        </template>`;

        this.root.replaceChildren(...renderResult);
        this.root.append(
          this.root.querySelector("template").content.cloneNode(true)
        );
      }

      // write-side: state
      dispatchEvent({ type = "custom", detail = {} }) {
        this.channel?.postMessage({ type, detail, target: this.attributes.id });
      }

      disconnectedCallback() {
        this.channel?.close();
      }
    }
  );
}
