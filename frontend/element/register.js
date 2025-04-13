//@ts-check
import * as Shared from "@onlyweb/shared";

import html from "./html.js";

/**
 * Registers a custom element with the global customElements map
 * @param {string} tag The tag of the element
 * @param {object} options The options setting up the element
 * @param {{ [name: string]: function }} [options.buildAttributes] The attributes of the element, that, when modified, will trigger a template build
 * @param {(buildAttributes: object) => HTMLCollection} options.handleBuild The core of the element: use it to build the template from which the shadow DOM will be constructed
 * @param {(buildAttributes: object) => void} [options.handleMount] Is called when the element is mounted: use it to set up the shadow DOM and register event listeners
 * @param {(buildAttributes: object) => void} [options.handleDismount] The dismount handler: use it to clean up event listeners and other resources
 * @example Register("my-element", {
 *  template: {
 *    buildAttributes: {
 *      "my-attribute": String,
 *      "my-boolean-attribute": Boolean
 *    },
 *    handleBuild: attributes => html`<div>${attributes["my-attribute"]}</div>`
 *  },
 * });
 * @returns {void} Nothing is returned: the element is registered in the global customElements map
 */
export default (tag, options) => {
  if (globalThis.customElements.get(tag)) {
    return Shared.Log({
      message: `Element ${tag} already registered.`,
      level: "warn",
    });
  }

  if (typeof options === "function") {
    options = {
      handleBuild: options,
    };
  }

  const {
    buildAttributes = {},
    handleBuild,
    handleMount = () => {},
    handleDismount = () => {},
  } = options;

  globalThis.customElements.define(
    tag,
    class extends HTMLElement {
      // element data - template attributes
      static observedAttributes = Object.keys(buildAttributes);

      #eventController = new AbortController();

      /** @type {(attributes: object) => void} */
      #handleMount;
      /** @type {(attributes: object) => HTMLCollection} */
      #handleTemplateBuild;
      /** @type {(attributes: object) => void} */
      #handleDismount;

      constructor() {
        super();

        this.#handleMount = handleMount.bind(this);
        this.#handleTemplateBuild = handleBuild.bind(this);
        this.#handleDismount = handleDismount.bind(this);

        /** @type {ShadowRoot} */
        this.template = this.attachShadow({ mode: "open" });
        this.buildAttributes = new Proxy(
          {},
          {
            deleteProperty: (_, name) => {
              this.removeAttribute(String(name));
              return true;
            },
            get: (_, name) =>
              this.#RESOLVE_ATTRIBUTE(
                String(name),
                this.getAttribute(String(name)),
              ),
            set: (_, name, value) => {
              this.setAttribute(
                String(name),
                this.#RESOLVE_ATTRIBUTE(String(name), value),
              );
              return true;
            },
          },
        );
      }

      connectedCallback() {
        Shared.Log({
          message: `[framework/frontend/element] <${tag}> mounted`,
          level: "debug",
        });

        this.#buildTemplate();
        requestAnimationFrame(() =>
          this.#handleMount(this.buildAttributes ?? {})
        );
      }

      /**
       * @param {string} name
       * @param {*} oldValue
       * @param {*} newValue
       */
      attributeChangedCallback(name, oldValue, newValue) {
        Shared.Log({
          message: `[framework/frontend/element] <${tag}> attributes changed`,
          detail: { name, oldValue, newValue },
          level: "debug",
        });

        this.#buildTemplate();
      }

      disconnectedCallback() {
        Shared.Log({
          message: `[framework/frontend/element] <${tag}> dismounted`,
          level: "debug",
        });

        this.#handleDismount(this.buildAttributes ?? {});

        this.#eventController.abort();
      }

      /**
       * @override
       * @param {string | keyof HTMLElementEventMap} [eventType]
       * @param {EventListenerOrEventListenerObject} [listener]
       * @param {AddEventListenerOptions} [options]
       */
      addEventListener(eventType, listener, options) {
        if (!eventType) {
          return;
        }

        if (!listener || typeof listener !== "function") {
          return;
        }

        Shared.Log({
          message:
            `[framework/frontend/element] <${tag}> listener added for "${eventType}" event`,
          level: "debug",
        });

        super.addEventListener(
          eventType,
          (event) => {
            event.stopPropagation();
            event.preventDefault();

            // You can't retarget an event, so we have to force it
            Object.defineProperty(event, "target", {
              writable: false,
              value: event
                .composedPath()
                .find((target) =>
                  /** @type {HTMLElement} */ (target).getAttribute?.("id")
                ),
            });

            let message =
              `[framework/frontend/element] <${tag}> listener for "${eventType}"`;

            const element = /** @type {HTMLElement} */ (event.target);

            if (event.target) {
              message +=
                ` triggered by internal <${element.tagName.toLocaleLowerCase()}>`;
            }

            Shared.Log({ message, detail: { event }, level: "debug" });

            return listener(event);
          },
          { signal: this.#eventController.signal, ...options },
        );
      }

      /**
       * @override
       * @param {string} selector
       * @returns {HTMLElement | null}
       * @throws {Error} Throws an error if the selector is invalid
       * @example
       * const myElement = document.querySelector("my-element");
       * myElement.querySelector("div");
       */
      querySelector(selector) {
        return this.template.querySelector(selector);
      }

      #buildTemplate() {
        if (!this.template) {
          Shared.Log({
            message:
              `[framework/frontend/element#UPDATE_TEMPLATE] <${tag}> template not yet initialized, skipping update`,
            level: "debug",
          });
          return;
        }

        Shared.Log({
          message:
            `[framework/frontend/element#UPDATE_TEMPLATE] updating template for <${tag}>`,
          level: "debug",
        });

        const templateResult =
          this.#handleTemplateBuild(this.buildAttributes ?? {}) ??
            html`<slot></slot>`;
        const templateWrapper = html`<template>
          <style>
            *:not(slot) {
              all: initial;
              box-sizing: border-box;
              /* content-visibility: auto; */
              isolation: isolate;
              touch-action: none;
              user-select: none;
            }
            style,
            script {
              display: none;
            }
          </style>
          ${templateResult}
        </template>`;

        this.template.replaceChildren(...templateWrapper);

        const newTemplateNode = this.template.querySelector("template");

        if (!newTemplateNode) {
          Shared.Log({
            message:
              `[framework/frontend/element#UPDATE_TEMPLATE] <${tag}> template missing <template> tag, cannot update template`,
            level: "warn",
          });
          return;
        }

        this.template.append(newTemplateNode.content.cloneNode(true));

        Shared.Log({
          message:
            `[framework/frontend/element#UPDATE_TEMPLATE] <${tag}> template updated`,
          level: "debug",
        });
      }

      /**
       * @param {string} name
       * @param {*} value
       */
      #RESOLVE_ATTRIBUTE(name, value) {
        const resolver = buildAttributes[name] ?? String;

        if (value === null) return void 0;
        if (resolver === Boolean) return this.#RESOLVE_BOOLEAN_ATTRIBUTE(value);

        return resolver(value);
      }

      /**
       * @param {string} value
       */
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
    },
  );
};
