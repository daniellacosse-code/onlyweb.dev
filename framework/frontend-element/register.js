import html from "./html.js";
import DeepProxy from "/framework/shared/deep-proxy.js";

export default (
  tag,
  {
    attributes = {},
    handleMount = defaultMount,
    handleRender = () => html`<slot></slot>`,
    handleRenderCleanup = defaultRenderCleanup,
    handleDismount = defaultDismount
  }
) => {
  if (globalThis.customElements.get(tag))
    return console.warn(`Element ${tag} already registered.`);

  globalThis.customElements.define(
    tag,
    class extends HTMLElement {
      #handleRender;
      #handleMount;
      #handleRenderCleanup;
      #handleDismount;
      #eventController = new AbortController();

      // element data - attributes
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

      // element lifecycle
      connectedCallback() {
        this.#handleMount = handleMount.bind(this);
        this.#handleRender = handleRender.bind(this);
        this.#handleRenderCleanup = handleRenderCleanup.bind(this);
        this.#handleDismount = handleDismount.bind(this);

        this.#handleMount(this.attributes);
        this.EXECUTE_RENDER();
      }

      attributeChangedCallback() {
        this.EXECUTE_RENDER();
      }

      disconnectedCallback() {
        this.#handleDismount(this.attributes, {
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

      querySelector(selector) {
        if (!selector || selector === "#") return;

        return (
          super.querySelector(selector) ?? this.root.querySelector(selector)
        );
      }

      getElementById(id) {
        return this.querySelector(`#${id}`);
      }

      // utility methods
      EXECUTE_RENDER() {
        if (!this.root) return;

        const renderResult =
          this.#handleRender(this.attributes) ?? html`<slot></slot>`;
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

        const previousActiveElement = this.root.activeElement?.cloneNode(true);

        let previousSelectionData = null;
        try {
          // TOOD: support multiple selections
          const selectionRange = this.root.getSelection().getRangeAt(0);

          // there seems to be no way to satisfactorily clone a selection range,
          // (even <rangeObject>.cloneRange() doesn't work as expected in all cases)
          // so we must do it manually after the render is complete (see below)
          previousSelectionData = {
            startContainer: selectionRange.startContainer,
            endContainer: selectionRange.endContainer,
            startOffset: selectionRange.startOffset,
            endOffset: selectionRange.endOffset
          };
        } catch (error) {
          // console.error(error);
        }

        this.root.replaceChildren(...renderWrapper);
        this.root.append(
          this.root.querySelector("template").content.cloneNode(true)
        );

        const previousSelectionRange = new Range();
        if (previousSelectionData) {
          // TOOD: we must retarget the start and end containers in the new tree

          previousSelectionRange.setStart(
            previousSelectionData.startContainer,
            previousSelectionData.startOffset
          );

          previousSelectionRange.setEnd(
            previousSelectionData.endContainer,
            previousSelectionData.endOffset
          );
        }

        // TODO: i think we pass through the element id only? not sure
        this.#handleRenderCleanup(this.attributes, {
          newActiveElement: this.getElementById(previousActiveElement?.id),
          previousActiveElement,
          previousSelectionRange
        });
      }

      // TODO: dedupe resolution logic across get and set
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

const defaultMount = function () {
  this.root = this.attachShadow({ mode: "open" });
};

const defaultRenderCleanup = function (
  _,
  { newActiveElement, previousActiveElement, previousSelectionRange }
) {
  if (newActiveElement) {
    newActiveElement.focus();
    newActiveElement.scrollTo(
      previousActiveElement.scrollTop,
      previousActiveElement.scrollLeft
    );
  }

  if (previousSelectionRange) {
    this.root.getSelection().removeAllRanges();
    this.root.getSelection().addRange(previousSelectionRange);
  }
};

const defaultDismount = function (_, { eventController }) {
  eventController.abort();
};
