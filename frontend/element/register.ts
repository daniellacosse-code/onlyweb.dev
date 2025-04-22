import { Registry } from "@onlyweb/shared";
import { OWFElement } from "./element.ts";
import type {
  AnyPrimitiveShape,
  AnyShape,
  ConvertPrimitiveShapeToConstructorShape as $,
} from "../types.ts";

/**
 * The configuration for registering an element
 */
export interface RegisterElementConfiguration<
  S extends AnyPrimitiveShape,
  T extends AnyShape,
> {
  /**
   * The attributes of the element, that, when modified, will trigger a template build
   */
  attributes?: $<S>;

  /**
   * The core of the element: use it to build the template from which the shadow DOM will be constructed
   */
  render?: (this: OWFElement<S> & T, buildAttributes: S) => HTMLCollection;

  /**
   * Is called when the element is mounted: use it to set up the shadow DOM and register event listeners
   */
  mount?: (this: OWFElement<S> & T, buildAttributes: S) => void;

  /**
   * The dismount handler: use it to clean up event listeners and other resources
   */
  dismount?: (this: OWFElement<S> & T, buildAttributes: S) => void;
}

/**
 * The options for registering an element
 */
export type RegisterElementOptions<
  S extends AnyPrimitiveShape,
  T extends AnyShape,
> =
  | RegisterElementConfiguration<S, T>
  | ((buildAttributes: S) => HTMLCollection);

const elementRegistry = new Registry<CustomElementConstructor>(
  (tag, classObject) => {
    globalThis.customElements.define(tag, classObject);
  },
);

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
export const registerElement = <
  S extends AnyPrimitiveShape,
  T extends AnyShape = AnyShape,
>(
  tag: string,
  options: RegisterElementOptions<S, T>,
): void => {
  if (typeof options === "function") {
    options = { render: options };
  }

  const {
    attributes: buildAttributes = {} as $<S>,
    render: handleBuild,
    mount: handleMount,
    dismount: handleDismount,
  } = options;

  elementRegistry.register(
    tag,
    // TODO: figure out how to properly override the addEventListener
    // @ts-ignore
    class extends OWFElement<S> {
      static observedAttributes = Object.keys(buildAttributes);

      override buildDefinition = buildAttributes;
      override handleTemplateBuild = handleBuild;
      override handleMount = handleMount;
      override handleDismount = handleDismount;
    },
  );
};
