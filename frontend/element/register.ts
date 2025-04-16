
import { log } from "@onlyweb/shared";
import { html } from "./html.ts";

/**
 * Registers a custom element with the global customElements map
 * @param tag The tag of the element
 * @param options The options setting up the element
 * @example 
 * 
 * ```js
 * register("my-element", {
 *  template: {
 *    buildAttributes: {
 *      "my-attribute": String,
 *      "my-boolean-attribute": Boolean
 *    },
 *    handleBuild: attributes => html`<div>${attributes["my-attribute"]}</div>`
 *  },
 * });
 * ```
 * @returns Nothing is returned: the element is registered in the global customElements map
 */
export const registerElement = (
  tag: string,
  options: ElementRegistrationOptions | ((buildAttributes: object) => HTMLCollection)
): void => {
  if (globalThis.customElements.get(tag)) {
    return log({
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
    handleMount = () => { },
    handleDismount = () => { },
  } = options;

  globalThis.customElements.define(
    tag,
    class extends HTMLElement {
      // element data - template attributes
      static observedAttributes = Object.keys(buildAttributes);

      buildAttributes: object;
      template: ShadowRoot;

      #eventController = new AbortController();

      #handleMount;
      #handleTemplateBuild;
      #handleDismount;

      constructor() {
        super();

        this.#handleMount = handleMount.bind(this);
        this.#handleTemplateBuild = handleBuild.bind(this);
        this.#handleDismount = handleDismount.bind(this);

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
                this.getAttribute(String(name)) ?? "",
              ),
            set: (_, name, value) => {
              this.setAttribute(
                String(name),
                String(this.#RESOLVE_ATTRIBUTE(String(name), value)),
              );
              return true;
            },
          },
        );
      }

      connectedCallback() {
        log({
          message: `[framework/frontend/element] <${tag}> mounted`,
          level: "debug",
        });

        this.#buildTemplate();
        requestAnimationFrame(() =>
          this.#handleMount(this.buildAttributes ?? {})
        );
      }

      attributeChangedCallback(name: string, oldValue: AnyAttribute, newValue: AnyAttribute) {
        log({
          message: `[framework/frontend/element] <${tag}> attributes changed`,
          detail: { name, oldValue, newValue },
          level: "debug",
        });

        this.#buildTemplate();
      }

      disconnectedCallback() {
        log({
          message: `[framework/frontend/element] <${tag}> dismounted`,
          level: "debug",
        });

        this.#handleDismount(this.buildAttributes ?? {});

        this.#eventController.abort();
      }

      override addEventListener(
        eventType: string | keyof HTMLElementEventMap, 
        listener: EventListenerOrEventListenerObject | null,
        options?: boolean | AddEventListenerOptions
      ) {
        if (!eventType) {
          return;
        }

        if (!listener || typeof listener !== "function") {
          return;
        }

        let resolvedOptions: AddEventListenerOptions = {
          signal: this.#eventController.signal
        };
        if (typeof options === "object") {
          resolvedOptions = { ...options, ...resolvedOptions };
        } else if (typeof options === "boolean") {
          resolvedOptions = { capture: options, ...resolvedOptions };
        }

        log({
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
                .find(target =>
                  (target as HTMLElement).getAttribute?.("id")
                ),
            });

            let message =
              `[framework/frontend/element] <${tag}> listener for "${eventType}"`;

            const element = (event.target as HTMLElement);

            if (event.target) {
              message +=
                ` triggered by internal <${element.tagName.toLocaleLowerCase()}>`;
            }

            log({ message, detail: { event }, level: "debug" });

            return listener(event);
          },
          resolvedOptions,
        );
      }

      override querySelector(selector: string): HTMLElement | null {
        return this.template.querySelector(selector);
      }

      #buildTemplate() {
        if (!this.template) {
          log({
            message:
              `[framework/frontend/element#UPDATE_TEMPLATE] <${tag}> template not yet initialized, skipping update`,
            level: "debug",
          });
          return;
        }

        log({
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
          log({
            message:
              `[framework/frontend/element#UPDATE_TEMPLATE] <${tag}> template missing <template> tag, cannot update template`,
            level: "warn",
          });
          return;
        }

        this.template.append(newTemplateNode.content.cloneNode(true));

        log({
          message:
            `[framework/frontend/element#UPDATE_TEMPLATE] <${tag}> template updated`,
          level: "debug",
        });
      }

      #RESOLVE_ATTRIBUTE(name: string, value: string): AnyAttribute {
        const resolver = buildAttributes[name] ?? String;

        if (value === null) return void 0;
        if (resolver === Boolean) return this.#RESOLVE_BOOLEAN_ATTRIBUTE(value);

        return resolver(value);
      }

      #RESOLVE_BOOLEAN_ATTRIBUTE(value: string): boolean {
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

export type AnyAttribute = string | number | object | boolean | void;
export type AnyAttributeConstructor = typeof String | typeof Number | typeof Object | typeof Boolean;

/**
 * The options for registering an element
 */
export interface ElementRegistrationOptions {
  /**
   * The attributes of the element, that, when modified, will trigger a template build
   */
  buildAttributes?: { [name: string]: AnyAttributeConstructor };

  /**
   * The core of the element: use it to build the template from which the shadow DOM will be constructed
   */
  handleBuild: (buildAttributes: object) => HTMLCollection;

  /**
   * Is called when the element is mounted: use it to set up the shadow DOM and register event listeners
   */
  handleMount?: (buildAttributes: object) => void;

  /**
   * The dismount handler: use it to clean up event listeners and other resources
   */
  handleDismount?: (buildAttributes: object) => void;
}
