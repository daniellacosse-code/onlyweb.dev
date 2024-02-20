import { makeCUID } from "/framework/shared/cuid.js";
import { html } from "./html.js";

export function DefineElement({
  tag = "custom-element",
  attributes = {},
  handleMount = () => {},
  handleRender = () => new Error("No render handler provided.")
}) {
  if (globalThis.customElements.get(tag))
    return console.warn(`Element ${tag} already defined.`);

  globalThis.customElements.define(
    tag,
    class extends HTMLElement {
      #handleRender;
      #handleMount;
      // constructor analogous
      connectedCallback() {
        this.root = this.attachShadow({ mode: "open" });
        this.host = this.root.host;

        this.#handleRender = handleRender.bind(this);
        this.#handleMount = handleMount.bind(this);

        this.attributes.id ??= makeCUID();

        this.#executeRender();
        this.#handleMount(this.attributes);
      }

      // read-side: attributes
      static observedAttributes = ["id", ...Object.keys(attributes)];
      get attributes() {
        return new Proxy(
          {},
          {
            deleteProperty: (_, name) => this.removeAttribute(name),
            get: (_, name) =>
              this.#attributeResolver(name, this.getAttribute(name)),
            set: (_, name, value) =>
              this.setAttribute(name, this.#attributeResolver(name, value)) ||
              true
          }
        );
      }

      #attributeResolver(name, value) {
        const providedResolver = attributes[name];
        const resolver = providedResolver ?? String;

        if (value === null) return null;
        if (resolver === Boolean && value === "") return true;

        return resolver(value);
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
              user-select: inherit;
              pointer-events: inherit;
            }
          </style>
          ${this.#handleRender(this.attributes)}
        </template>`;

        this.root.replaceChildren(...renderResult);
        this.root.append(
          this.root.querySelector("template").content.cloneNode(true)
        );
      }

      // write-side: events
      dispatchEvent({ type, detail } = {}) {
        const ephemeralChannel = new BroadcastChannel(type);

        ephemeralChannel.postMessage({
          type,
          detail,
          // we can't clone an element and have to send the ID -
          // so that the reciever can find the target
          __targetID: `#${this.attributes.id}`
        });

        ephemeralChannel.close();
      }

      disconnectedCallback() {
        this.channel?.close();
      }
    }
  );
}
