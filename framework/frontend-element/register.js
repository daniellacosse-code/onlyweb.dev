import html from "./html.js";
import DeepProxy from "/framework/shared/deep-proxy.js";

export default (
  tag,
  {
    templateAttributes = {},
    handleMount = defaultMount,
    handleTemplateBuild = () => html`<slot></slot>`,
    handleDismount = defaultDismount
  }
) => {
  if (globalThis.customElements.get(tag))
    return console.warn(`Element ${tag} already registered.`);

  globalThis.customElements.define(
    tag,
    class extends HTMLElement {
      #handleMount;
      #handleTemplateBuild;
      #handleDismount;
      #eventController = new AbortController();

      // element data - template attributes
      static observedAttributes = Object.keys(templateAttributes);

      get templateAttributes() {
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

      // element lifecycle
      connectedCallback() {
        this.#handleMount = handleMount.bind(this);
        this.#handleTemplateBuild = handleTemplateBuild.bind(this);
        this.#handleDismount = handleDismount.bind(this);

        this.#handleMount(this.templateAttributes);
        this.UPDATE_TEMPLATE();
      }

      attributeChangedCallback() {
        this.UPDATE_TEMPLATE();
      }

      disconnectedCallback() {
        this.#handleDismount(this.templateAttributes, {
          self: this,
          eventController: this.#eventController
        });
      }

      // standard method wrappers
      addEventListener(eventType, listener, options) {
        super.addEventListener(
          eventType,
          (event) => {
            event.stopPropagation();
            event.preventDefault();

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
          { signal: this.#eventController.signal, ...options }
        );
      }

      // system methods
      UPDATE_TEMPLATE() {
        if (!this.template) return;

        const templateResult =
          this.#handleTemplateBuild(this.templateAttributes) ??
          html`<slot></slot>`;
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
        const resolver = templateAttributes[name] ?? String;

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
        if (resolver === Boolean) return this.#RESOLVE_BOOLEAN_ATTRIBUTE(value);

        return resolver(value);
      }

      #RESOLVE_ATTRIBUTE_SET(name, value) {
        const resolver = templateAttributes[name] ?? String;

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
        if (resolver === Boolean) return this.#RESOLVE_BOOLEAN_ATTRIBUTE(value);

        return resolver(value);
      }

      #RESOLVE_BOOLEAN_ATTRIBUTE(value) {
        switch (value) {
          case "true":
          case "": // empty string is considered true
            return true;
          case "false":
            return false;
          default:
            return Boolean(value);
        }
      }
    }
  );

  console.debug(`Registered element "<${tag}>".`);
};

const defaultMount = function () {
  this.template = this.attachShadow({ mode: "open" });
  this.host = this;
};

const defaultDismount = function (_, { eventController }) {
  eventController.abort();
};
