import { cuid } from "./cuid.js";

export class CustomElement extends HTMLElement {
  static tag = "custom-element";
  static attributes = {};

  render() {
    throw new Error("CustomElement#render must be implemented");
  }

  get attributes() {
    return new Proxy(
      {},
      {
        get: (_, attribute) => {
          const attributeParser =
            this.constructor.attributes[attribute] ?? String;

          return attributeParser(this.getAttribute(attribute));
        },
        set: (_, attribute, value) => {
          const rawValue = String(value);

          this.setAttribute(attribute, rawValue);
          this._executeRender();

          return true;
        }
      }
    );
  }

  // TODO: why doesn't this.setAttribute trigger this?
  attributeChangedCallback() {
    this._executeRender();
  }

  connectedCallback() {
    this.root = this.attachShadow({ mode: "open" });
    this.attributes.id = cuid({ namespace: this.constructor.tag });

    this._executeRender();
  }

  _executeRender() {
    this.root.replaceChildren(
      new Range().createContextualFragment(
        html`<template>
          <style>
            *,
            ::slotted(*) {
              all: initial;
            }
            style,
            script {
              display: none;
            }
          </style>
          ${this.render(this.attributes)}
        </template>`
      )
    );

    const templateNode = this.root.querySelector("template");

    this.root.append(templateNode.content.cloneNode(true));
  }
}
