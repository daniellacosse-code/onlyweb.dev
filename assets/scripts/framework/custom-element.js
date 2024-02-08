import { cuid } from "./cuid.js";

export function CustomElement({
  tag = "custom-element",
  attributes = {},
  render = () => new Error("No render function provided.")
}) {
  customElements.define(
    tag,
    class extends HTMLElement {
      static observedAttributes = [...Object.keys(attributes), "id"];
    
      get attributes() {
        return new Proxy(
          {},
          {
            deleteProperty: (_, attribute) => this.removeAttribute(attribute),
            get: (_, attribute) =>
              (attributes[attribute] ?? String)(this.getAttribute(attribute)),
            set: (_, attribute, value) =>
              this.setAttribute(attribute, String(value))
          }
        );
      }

      attributeChangedCallback() { this._executeRender(); }

      connectedCallback() {
        this.root = this.attachShadow({ mode: "open" });
        this.attributes.id = cuid({ namespace: tag });
      }

      _executeRender() {
        this.root.replaceChildren(
          new Range().createContextualFragment(
            html`<template>
              <style>
                *, ::slotted(*) { all: initial; }
                style, script { display: none; }
              </style>
              ${render(this.attributes)}
            </template>`
          )
        );

        this.root.append(
          this.root.querySelector("template").content.cloneNode(true)
        );
      }
    }
  );
}
