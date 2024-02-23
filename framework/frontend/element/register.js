import { html } from "/framework/frontend/element/html.js";

export function Register({
  tag = "custom-element",
  attributes = {},
  handleEvent = () => {},
  handleMount = () => {},
  handleRender = () => html`<slot></slot>`,
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
      #handleEvent;

      static observedAttributes = Object.keys(attributes);

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
        this.host = this.root.host;

        this.#handleEvent = handleEvent.bind(this);
        this.#handleMount = handleMount.bind(this);
        this.#handleRender = handleRender.bind(this);
        this.#handleUnmount = handleUnmount.bind(this);

        this.EXECUTE_RENDER();
        this.#handleMount(this.attributes, this);
      }

      disconnectedCallback() {
        this.#handleUnmount(this.attributes, this);
      }

      EXECUTE_RENDER() {
        if (!this.root) return;

        const renderResult = html`<template>
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
          ${this.#handleRender(this.attributes, this)}
        </template>`;

        this.root.replaceChildren(...renderResult);
        this.root.append(
          this.root.querySelector("template").content.cloneNode(true)
        );
      }

      #RESOLVE_ATTRIBUTE(name, value) {
        const providedResolver = attributes[name];
        const resolver = providedResolver ?? String;

        if (value === null) return null;
        if (resolver === Boolean && value === "") return true;

        return resolver(value);
      }
    }
  );
}
