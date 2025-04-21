
import { log } from "@onlyweb/shared";
import { type AnyAttributeShape, type GetAttributeShapeDefinition, OWFElement } from "./element.ts";

/**
 * The options for registering an element
 */
export interface RegisterElementConfiguration<S extends AnyAttributeShape, T extends object> {
  /**
   * The attributes of the element, that, when modified, will trigger a template build
   */
  buildAttributes?: GetAttributeShapeDefinition<S>;

  /**
   * The core of the element: use it to build the template from which the shadow DOM will be constructed
   */
  handleBuild?: (this: OWFElement<S> & T, buildAttributes: S) => HTMLCollection;

  /**
   * Is called when the element is mounted: use it to set up the shadow DOM and register event listeners
   */
  handleMount?: (this: OWFElement<S> & T, buildAttributes: S) => void;

  /**
   * The dismount handler: use it to clean up event listeners and other resources
   */
  handleDismount?: (this: OWFElement<S> & T, buildAttributes: S) => void;
}

export type RegisterElementOptions<S extends AnyAttributeShape, T extends object> =
  | RegisterElementConfiguration<S, T>
  | ((buildAttributes: S) => HTMLCollection);

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
export const registerElement = <S extends AnyAttributeShape, T extends object = {}>(
  tag: string,
  options: RegisterElementOptions<S, T>
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
    buildAttributes = {} as GetAttributeShapeDefinition<S>,
    handleBuild,
    handleMount,
    handleDismount,
  } = options;

  globalThis.customElements.define(
    tag,
    class extends OWFElement<S> {
      static observedAttributes = Object.keys(buildAttributes)

      override buildDefinition = buildAttributes
      override handleTemplateBuild = handleBuild;
      override handleMount = handleMount;
      override handleDismount = handleDismount;
    }
  );
};
