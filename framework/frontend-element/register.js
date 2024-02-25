import DeepProxy from "/framework/shared/deep-proxy.js";
import { html } from "./html.js";

export function Register({
  tag = "custom-element",
  attributes = {},
  handleMount = () => {},
  handleRender = () => null
}) {
  if (globalThis.customElements.get(tag))
    return console.warn(`Element ${tag} already registered.`);

  globalThis.customElements.define(
    tag,
    class extends HTMLElement {
      #handleRender;
      #handleMount;
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

      async attributeChangedCallback() {
        await this.EXECUTE_RENDER();
      }

      connectedCallback() {
        this.root = this.attachShadow({ mode: "open" });

        this.#handleMount = handleMount.bind(this);
        this.#handleRender = handleRender.bind(this);

        this.#handleMount(this.attributes);
        this.EXECUTE_RENDER();
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

      querySelector(selector) {
        return (
          super.querySelector(selector) ?? this.root.querySelector(selector)
        );
      }

      async EXECUTE_RENDER() {
        if (!this.root) return;

        const renderResult =
          (await this.#handleRender(this.attributes)) ?? html`<slot></slot>`;
        const renderWrapper = html`<template>
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
          ${renderResult}
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
}
