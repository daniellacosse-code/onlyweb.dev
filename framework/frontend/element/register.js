//@ts-check
/// <reference lib="dom" />
/// <reference lib="dom.iterable" />

import Shared from "/framework/shared/module.js";
import html from "./html.js";

/**
 * @typedef OnlyWebElement
 * @property {Function} addEventListener The method to add an event listener to the element. Retargets the event to the source element for you.
 * @property {Function} attachShadow The method to attach a shadow DOM to the element - same as the native method.
 * @property {Function} UPDATE_TEMPLATE The method to update the template - call it manually only when the template fails to update automatically.
 * @property {Object} templateAttributes The attributes of the element, that, when modified, will trigger a template build.
 * @property {OnlyWebElement} host The element instance itself, as hosted by its parent.
 * @property {ShadowRoot} template The shadow DOM of the element, reperesenting the element's internals.
 */

/**
 * Registers a custom element with the global customElements map
 * @param {string} tag The tag of the element
 * @param {Object} options The options setting up the element
 * @param {{ [name: string]: Function }} options.templateAttributes The attributes of the element, that, when modified, will trigger a template build
 * @param {Function} options.handleMount Is called when the element is mounted: use it to set up the shadow DOM and register event listeners
 * @param {Function} options.handleTemplateBuild The core of the element: use it to build the template from which the shadow DOM will be constructed
 * @param {Function} options.handleDismount The dismount handler: use it to clean up event listeners and other resources
 * @example Register("my-element", {
 *  templateAttributes: {
 *    "my-attribute": String,
 *    "my-boolean-attribute": Boolean
 *  },
 *  handleTemplateBuild: attributes => html`<div>${attributes["my-attribute"]}</div>`
 * });
 * @returns {void} Nothing is returned: the element is registered in the global customElements map
 */
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
    return Shared.Log({
      message: `Element ${tag} already registered.`,
      level: "warn"
    });

  globalThis.customElements.define(
    tag,
    class extends HTMLElement {
      /** @type {Function} */
      #handleMount;
      /** @type {Function} */
      #handleTemplateBuild;
      /** @type {Function} */
      #handleDismount;
      #eventController = new AbortController();

      // element data - template attributes
      static observedAttributes = Object.keys(templateAttributes);

      constructor() {
        super();

        /** @type {ShadowRoot | null} */
        this.template = null;

        this.#handleMount = handleMount.bind(this);
        this.#handleTemplateBuild = handleTemplateBuild.bind(this);
        this.#handleDismount = handleDismount.bind(this);
      }

      get templateAttributes() {
        return new Proxy(
          {},
          {
            deleteProperty: (_, name) => {
              this.removeAttribute(String(name));
              return true;
            },
            get: (_, name) =>
              this.#RESOLVE_ATTRIBUTE(
                String(name),
                this.getAttribute(String(name))
              ),
            set: (_, name, value) => {
              this.setAttribute(
                String(name),
                this.#RESOLVE_ATTRIBUTE(String(name), value)
              );
              return true;
            }
          }
        );
      }

      // element lifecycle
      connectedCallback() {
        Shared.Log({
          message: `[framework/frontend/element] <${tag}> mounted`,
          level: "debug"
        });

        this.#handleMount(this.templateAttributes, { self: this });
        this.UPDATE_TEMPLATE();
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
          level: "debug"
        });

        this.UPDATE_TEMPLATE();
      }

      disconnectedCallback() {
        Shared.Log({
          message: `[framework/frontend/element] <${tag}> dismounted`,
          level: "debug"
        });

        this.#handleDismount(this.templateAttributes, {
          self: this,
          eventController: this.#eventController
        });
      }

      // standard method wrappers
      /**
       * @param {keyof ElementEventMap} eventType
       * @param {(event: Event) => void} listener
       * @param {AddEventListenerOptions} options
       */
      addEventListener(eventType, listener, options) {
        Shared.Log({
          message: `[framework/frontend/element] <${tag}> listener added for "${eventType}" event`,
          level: "debug"
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
                )
            });

            let message = `[framework/frontend/element] <${tag}> listener for "${eventType}"`;

            const element = /** @type {HTMLElement} */ (event.target);

            if (event.target)
              message += ` triggered by internal <${element.tagName.toLocaleLowerCase()}>`;

            Shared.Log({ message, detail: { event }, level: "debug" });

            return listener(event);
          },
          { signal: this.#eventController.signal, ...options }
        );
      }

      // system methods
      UPDATE_TEMPLATE() {
        if (!this.template) {
          Shared.Log({
            message: `[framework/frontend/element#UPDATE_TEMPLATE] <${tag}> template not yet initialized, skipping update`,
            level: "debug"
          });
          return;
        }

        Shared.Log({
          message: `[framework/frontend/element#UPDATE_TEMPLATE] updating template for <${tag}>`,
          level: "debug"
        });

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

        const newTemplateNode = this.template.querySelector("template");

        if (!newTemplateNode) {
          Shared.Log({
            message: `[framework/frontend/element#UPDATE_TEMPLATE] <${tag}> template missing <template> tag, cannot update template`,
            level: "warn"
          });
          return;
        }

        this.template.append(newTemplateNode.content.cloneNode(true));

        Shared.Log({
          message: `[framework/frontend/element#UPDATE_TEMPLATE] <${tag}> template updated`,
          level: "debug"
        });
      }

      /**
       * @param {string} name
       * @param {any} value
       */
      #RESOLVE_ATTRIBUTE(name, value) {
        const resolver = templateAttributes[name] ?? String;

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
    }
  );
};

/**
 * @param {Object} _
 * @param {Object} options
 * @param {OnlyWebElement} options.self
 */
const defaultMount = function (_, { self }) {
  self.template = self.attachShadow({ mode: "open" });
  self.host = self;
};

/**
 * @param {Object} _
 * @param {Object} options
 * @param {AbortController} options.eventController
 */
const defaultDismount = function (_, { eventController }) {
  eventController.abort();
};
