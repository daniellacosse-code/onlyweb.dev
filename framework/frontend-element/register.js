import html from "./html.js";
import DeepProxy from "/framework/shared/deep-proxy.js";

export default (
  tag,
  {
    attributes = {},
    handleMount = () => {},
    handleTemplateUpdate = () => html`<slot></slot>`
  }
) => {
  if (globalThis.customElements.get(tag))
    return console.warn(`Element ${tag} already registered.`);

  globalThis.customElements.define(
    tag,
    class extends HTMLElement {
      #handleMount;
      #handleTemplateUpdate;
      #abortController = new AbortController();

      static observedAttributes = Object.keys(attributes);

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
        this.UPDATE_TEMPLATE();
      }

      connectedCallback() {
        this.template = this.attachShadow({ mode: "open" });
        this.host = this;

        this.#handleMount = handleMount.bind(this);
        this.#handleTemplateUpdate = handleTemplateUpdate.bind(this);

        this.#handleMount(this.attributes);
        this.UPDATE_TEMPLATE();
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

      UPDATE_TEMPLATE() {
        if (!this.template) return;

        const templateResult =
          this.#handleTemplateUpdate(this.attributes) ?? html`<slot></slot>`;
        const templateWrapper = html`<template>
          <style>
            *:not(slot) {
              all: initial;
              box-sizing: border-box;
            }
            style,
            script {
              display: none;
            }
          </style>
          ${templateResult}
        </template>`;

        this.template.replaceChildren(...templateWrapper);
        this.template.append(
          this.template.querySelector("template").content.cloneNode(true)
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
        if (resolver === Boolean && value === "false") return false;

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
        if (resolver === Boolean && value === "false") return false;

        return resolver(value);
      }
    }
  );

  console.debug(`Registered element "<${tag}>".`);
};
