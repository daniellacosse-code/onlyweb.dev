import { makeCUID } from "/framework/shared/cuid.js";
import { html } from "./html.js";

export function DefineElement({
  tag = "custom-element",
  attributes = {},
  handleMount = () => {},
  handleRender = () => new Error("No render handler provided.")
}) {
  customElements.define(
    tag,
    class extends HTMLElement {
      // constructor analogous
      connectedCallback() {
        this.root = this.attachShadow({ mode: "open" });
        this.attributes.id ??= makeCUID();
        if (this.attributes.store)
          this.store = new BroadcastChannel(this.attributes.store);

        this.handleMount = handleMount.bind(this);
        this.handleMount(this.attributes);

        this.handleRender = handleRender.bind(this);
        this.#executeRender();
      }

      // read-side: attributes
      static observedAttributes = ["id", "store", ...Object.keys(attributes)];
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
          </style>
          ${this.handleRender(this.attributes)}
        </template>`;

        this.root.replaceChildren(...renderResult);
        this.root.append(
          this.root.querySelector("template").content.cloneNode(true)
        );
      }

      // write-side: store
      dispatchEvent({ type = "custom", detail }) {
        this.store?.postMessage({ type, detail, target: this });
      }

      disconnectedCallback() {
        this.store?.close();
      }
    }
  );
}
