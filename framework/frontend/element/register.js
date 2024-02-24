import DeepProxy from "/framework/shared/deep-proxy.js";
import { html } from "/framework/frontend/element/html.js";

export function Register({
  tag = "custom-element",
  attributes = {},
  handleMount = () => {},
  handleRender = () => null
}) {
  if (globalThis.customElements.get(tag))
    return console.warn(`Element ${tag} already defined.`);

  globalThis.customElements.define(
    tag,
    class extends HTMLElement {
      #handleRender;
      #handleMount;
      #abortController = new AbortController();

      static observedAttributes = ["slot", ...Object.keys(attributes)];

      get attributes() {
        return new Proxy(
          {},
          {
            deleteProperty: (_, name) => this.removeAttribute(name),
            get: (_, name) =>
              this.#RESOLVE_ATTRIBUTE_GET(name, this.getAttribute(name)),
            set: (_, name, value) => {
              this.setAttribute(name, this.#RESOLVE_ATTRIBUTE_SET(name, value));
              return true;
            }
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

        this.#handleMount(this.attributes);
        this.attributes.slot = "root";
      }

      disconnectedCallback() {
        this.#abortController.abort();
      }

      addEventListener(eventType, listener, options) {
        super.addEventListener(
          eventType,
          (event) => {
            // You can't change the target of an event by default,
            // so we have to force it
            Object.defineProperty(event, "target", {
              writable: false,
              value: event
                .composedPath()
                .find((target) => target.attributes?.id)
            });

            return listener(event);
          },
          { signal: this.#abortController.signal, ...options }
        );
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
          <slot name="root">${renderResult}</slot>
        </template>`;

        this.root.replaceChildren(...renderWrapper);
        this.root.append(
          this.root.querySelector("template").content.cloneNode(true)
        );
      }

      #RESOLVE_ATTRIBUTE_GET(name, value) {
        const resolver = attributes[name] ?? String;

        if (value === null) return void 0;
        if (resolver === JSON) {
          try {
            return DeepProxy(JSON.parse(value), {
              set: (rootObject) => {
                return Reflect.set(
                  this.attributes,
                  name,
                  JSON.stringify(rootObject)
                );
              }
            });
          } catch {
            return void 0;
          }
        }
        if (resolver === Boolean && value === "") return true;

        return resolver(value);
      }

      #RESOLVE_ATTRIBUTE_SET(name, value) {
        const resolver = attributes[name] ?? String;

        if (value === null) return void 0;
        if (resolver === JSON) {
          if (value === "") return void 0;
          if (typeof value === "string") return value;

          try {
            return JSON.stringify(value);
          } catch {
            return void 0;
          }
        }
        if (resolver === Boolean && value === "") return true;

        return resolver(value);
      }
    }
  );
}
