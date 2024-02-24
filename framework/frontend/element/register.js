import { html } from "/framework/frontend/element/html.js";

export function Register({
  tag = "custom-element",
  attributes = {},
  handleMount = () => {},
  handleRender = () => null,
  handleUnmount = () => {}
}) {
  if (globalThis.customElements.get(tag))
    return console.warn(`Element ${tag} already defined.`);

  globalThis.customElements.define(
    tag,
    class extends HTMLElement {
      #handleRender;
      #handleMount;
      #handleUnmount;

      static observedAttributes = ["slot", ...Object.keys(attributes)];

      get attributes() {
        return new Proxy(
          {},
          {
            deleteProperty: (_, name) => this.removeAttribute(name),
            get: (_, name) =>
              this.#RESOLVE_ATTRIBUTE(name, this.getAttribute(name)),
            set: (_, name, value) =>
              this.setAttribute(name, this.#RESOLVE_ATTRIBUTE(name, value)) ||
              true
          }
        );
      }

      attributeChangedCallback() {
        this.EXECUTE_RENDER();
      }

      connectedCallback() {
        this.root = this.attachShadow({ mode: "open" });

        this.#handleMount = handleMount.bind(this);
        this.#handleRender = handleRender.bind(this);
        this.#handleUnmount = handleUnmount.bind(this);

        this.#handleMount(this.attributes);
        this.EXECUTE_RENDER();
      }

      disconnectedCallback() {
        this.#handleUnmount(this.attributes);
      }

      EXECUTE_RENDER() {
        if (!this.root) return;

        const renderResult = this.#handleRender(this.attributes) ?? html``;
        const renderWrapper = html`<template>
          <style>
            * {
              all: initial;
              box-sizing: border-box;
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
          ${renderResult}
        </template>`;

        this.root.replaceChildren(...renderWrapper);
        this.root.append(
          this.root.querySelector("template").content.cloneNode(true)
        );
      }

      #RESOLVE_ATTRIBUTE(name, value) {
        const providedResolver = attributes[name];
        const resolver = providedResolver ?? String;

        if (resolver === JSON) {
          if (!value) return {};
          if (typeof value === "object") return JSON.stringify(value);
          if (typeof value === "string") return JSON.parse(value);
        }
        if (resolver === Boolean && value === "") return true;
        if (value === null) return void 0;

        return resolver(value);
      }
    }
  );
}
