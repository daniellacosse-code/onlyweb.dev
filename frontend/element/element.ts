import { log } from "@onlyweb/shared";
import { html } from "./html.ts";
import type {
  AnyPrimitiveShape,
  ConvertPrimitiveShapeToConstructorShape as $,
} from "./types.ts";

/**
 * The base class for custom elements created within the OnlyWeb Framework.
 * It extends `HTMLElement` and provides lifecycle management, attribute handling
 * via a Proxy, automatic template rebuilding on attribute changes, Shadow DOM
 * encapsulation, and automatic event listener cleanup.
 *
 * @template S An object shape defining the element's observed attributes and their primitive types (e.g., `{ count: number, label: string }`).
 */
export class OWFElement<S extends AnyPrimitiveShape> extends HTMLElement {
  /**
   * A Proxy object providing access to the element's attributes based on `buildDefinition`.
   * Getting a property retrieves the corresponding attribute value, converting it to the defined type.
   * Setting a property sets the corresponding attribute value after converting it to a string.
   * Deleting a property removes the corresponding attribute.
   */
  buildAttributes: S;

  /**
   * The definition mapping attribute names to their expected constructor types (String, Number, Boolean).
   * Used by the `buildAttributes` Proxy and `attributeChangedCallback` for type coercion.
   * @internal
   */
  buildDefinition: $<S>;

  /**
   * An optional function provided during registration, called after the element is
   * connected to the DOM and the initial template is built. Ideal for setting up
   * event listeners or performing initial DOM manipulations within the shadow root.
   * @param {S} buildAttributes - The current state of the element's attributes.
   * @internal
   */
  handleMount?: (buildAttributes: S) => void;

  /**
   * An optional function provided during registration, responsible for generating
   * the HTML content of the element's shadow DOM. Called initially during mount
   * and whenever an observed attribute changes.
   * @param {S} buildAttributes - The current state of the element's attributes.
   * @returns {HTMLCollection} The collection of HTML elements to render in the shadow DOM.
   * @internal
   */
  handleTemplateBuild?: (buildAttributes: S) => HTMLCollection;

  /**
   * An optional function provided during registration, called when the element
   * is disconnected from the DOM. Ideal for cleaning up resources or state.
   * Note: Event listeners added via the overridden `addEventListener` are cleaned up automatically.
   * @param {S} buildAttributes - The current state of the element's attributes.
   * @internal
   */
  handleDismount?: (buildAttributes: S) => void;

  /**
   * Manages the abort signal for automatically removing event listeners
   * when the element is disconnected.
   * @internal
   */
  readonly #eventController = new AbortController();
  /**
   * The shadow root for the custom element, providing DOM encapsulation.
   * @internal
   */
  readonly #root: ShadowRoot;

  /**
   * Creates an instance of OWFElement.
   * Initializes the shadow root and sets up the `buildAttributes` Proxy.
   * @param {$<S>} buildDefinition - The definition mapping attribute names to their constructor types.
   */
  constructor(buildDefinition: $<S>) {
    super();

    this.buildDefinition = buildDefinition;
    this.buildAttributes = new Proxy<S>(
      {} as S, // Start with an empty object, values are derived from attributes
      {
        /** @internal Deletes the corresponding attribute. */
        deleteProperty: (_, name) => {
          this.removeAttribute(String(name));
          return true;
        },
        /** @internal Gets and resolves the attribute value. */
        get: (_, name) =>
          this.#RESOLVE_ATTRIBUTE(
            name as keyof S,
            this.getAttribute(String(name)), // Pass null if attribute doesn't exist
          ),
        /** @internal Sets the attribute value after string conversion. */
        set: (_, name, value) => {
          // Handle boolean attribute setting according to HTML conventions
          if (this.buildDefinition[name as keyof S] === Boolean) {
            if (value) {
              this.setAttribute(String(name), ""); // Presence indicates true
            } else {
              this.removeAttribute(String(name)); // Absence indicates false
            }
          } else {
            // Set other attributes, converting value to string
            this.setAttribute(
              String(name),
              String(value), // Directly stringify the incoming value
            );
          }
          return true;
        },
      },
    );

    this.#root = this.attachShadow({ mode: "open" });
  }

  /**
   * Standard custom element lifecycle callback. Called when the element is
   * inserted into the DOM. Builds the initial template and calls `handleMount`.
   * @internal
   */
  connectedCallback() {
    log({
      message: `[frontend/element] <${this.tagName}> mounted`,
      level: "debug",
    });

    this.#buildTemplate();
    // Use requestAnimationFrame to ensure the element is fully painted before mount logic
    requestAnimationFrame(() => this.handleMount?.(this.buildAttributes));
  }

  /**
   * Standard custom element lifecycle callback. Called when one of the element's
   * observed attributes changes. Rebuilds the template.
   * @param {keyof S} name - The name of the attribute that changed.
   * @param {S[keyof S] | null} oldValue - The previous value of the attribute.
   * @param {S[keyof S] | null} newValue - The new value of the attribute.
   * @internal
   */
  attributeChangedCallback(
    name: keyof S,
    oldValue: string | null, // Actual type from DOM
    newValue: string | null, // Actual type from DOM
  ) {
    // Log the raw string values received from the DOM
    log({
      message: `[frontend/element] <${this.tagName}> attribute '${
        String(name)
      }' changed`,
      detail: { name: String(name), oldValue, newValue },
      level: "debug",
    });

    // No need to compare resolved values here, just rebuild if the attribute changed at all.
    // The buildAttributes proxy ensures the latest resolved value is used in handleTemplateBuild.
    this.#buildTemplate();
  }

  /**
   * Standard custom element lifecycle callback. Called when the element is
   * removed from the DOM. Calls `handleDismount` and aborts the event controller
   * to clean up listeners.
   * @internal
   */
  disconnectedCallback() {
    log({
      message: `[frontend/element] <${this.tagName}> dismounted`,
      level: "debug",
    });

    this.handleDismount?.(this.buildAttributes);

    // Abort the controller, automatically removing listeners added with its signal.
    this.#eventController.abort();
  }

  /**
   * Overrides the standard `addEventListener`.
   * Automatically attaches the internal AbortSignal to the listener options,
   * ensuring the listener is removed when the element is disconnected.
   * It also attempts to retarget the event to the first ancestor with an ID
   * within the composed path and stops propagation/prevents default behavior.
   *
   * @param {string} eventType - The type of event to listen for (e.g., 'click').
   * @param {EventListenerOrEventListenerObject | null} listener - The callback function or object to execute when the event occurs.
   * @param {boolean | AddEventListenerOptions} [options] - Optional configuration for the listener (capture, once, passive). The `signal` option will be overridden.
   * @override
   * @returns {void}
   */
  // TODO: figure out how to properly override the addEventListener
  // @ts-ignore - Ignoring potential signature mismatch warnings if strict checks are enabled elsewhere.
  override addEventListener(
    eventType: string,
    listener: EventListenerOrEventListenerObject | null,
    options?: boolean | AddEventListenerOptions,
  ): void {
    // Basic validation
    if (!eventType || !listener) {
      return;
    }

    // Ensure listener is a function for the wrapper logic (EventListenerObject needs different handling if supported)
    if (typeof listener !== "function") {
      log({
        message:
          `[frontend/element] <${this.tagName}> addEventListener called with non-function listener for "${eventType}". Standard behavior invoked.`,
        level: "warn",
      });
      // Fallback to standard behavior if listener is not a simple function
      super.addEventListener(eventType, listener, options);
      return;
    }

    // Combine provided options with the internal abort signal
    let resolvedOptions: AddEventListenerOptions = {};
    if (typeof options === "object") {
      resolvedOptions = { ...options, signal: this.#eventController.signal };
    } else if (typeof options === "boolean") {
      resolvedOptions = {
        capture: options,
        signal: this.#eventController.signal,
      };
    } else {
      resolvedOptions = { signal: this.#eventController.signal };
    }

    log({
      message:
        `[frontend/element] <${this.tagName}> listener added for "${eventType}" event with auto-cleanup`,
      level: "debug",
    });

    // Wrap the listener to handle stopPropagation, preventDefault, and retargeting
    const wrappedListener = (event: Event) => {
      event.stopPropagation();
      event.preventDefault();

      // Attempt to retarget the event to the nearest ancestor with an ID
      // This helps identify the logical source of the event within the component's structure.
      const retargetedElement = event
        .composedPath()
        .find((target) =>
          (target instanceof Element) && target.hasAttribute("id")
        );

      // Use Object.defineProperty for robustness, though direct assignment might work in many cases.
      Object.defineProperty(event, "target", {
        value: retargetedElement ?? event.target, // Fallback to original target if no ID found
        writable: false, // Prevent further modification
        configurable: true, // Allow potential future re-definition if needed
      });

      let message =
        `[frontend/element] <${this.tagName}> listener for "${eventType}"`;

      const element = event.target as Element;

      if (element) {
        message += ` triggered by internal <${
          element.tagName?.toLowerCase() ?? "unknown"
        }>${element.id ? ` id="${element.id}"` : ""}`;
      }

      log({ message, detail: { event }, level: "debug" });

      // Execute the original listener
      listener(event); // No return needed from wrapper
    };

    super.addEventListener(
      eventType,
      wrappedListener,
      resolvedOptions,
    );
  }

  /**
   * Overrides the standard `querySelector`.
   * Queries for elements within the element's shadow root instead of the light DOM.
   *
   * @param {string} selector - A DOMString containing one or more selectors to match against.
   * @returns {HTMLElement | null} The first `HTMLElement` matching the selector within the shadow root, or `null` if no matches are found.
   * @override
   */
  override querySelector(selector: string): HTMLElement | null {
    // The standard querySelector on ShadowRoot returns Element | null.
    // Casting to HTMLElement | null assuming only HTML elements are expected.
    return this.#root.querySelector(selector) as HTMLElement | null;
  }

  /**
   * Rebuilds the element's shadow DOM content using the `handleTemplateBuild` function.
   * It wraps the result in a `<template>` tag along with default styles,
   * replaces the shadow root's children with the template, and then appends
   * the cloned content of the template to the shadow root.
   * @internal
   */
  #buildTemplate() {
    // Guard against calls before the shadow root is initialized (shouldn't happen with current logic)
    if (!this.#root) {
      log({
        message:
          `[frontend/element#buildTemplate] <${this.tagName}> shadow root not initialized, skipping build.`,
        level: "warn",
      });
      return;
    }

    log({
      message:
        `[frontend/element#buildTemplate] updating template for <${this.tagName}>`,
      level: "debug",
    });

    // Get the content from the user-defined function or use a default slot
    const templateResult = this.handleTemplateBuild?.(this.buildAttributes) ??
      html`<slot></slot>`; // Default content allows light DOM projection

    // Create a template element to hold the styles and content
    // Using html`` ensures proper handling of the templateResult (HTMLCollection)
    const templateWrapper = html`<template>
      <style>
        /* Basic reset/scoping styles */
        :host { /* Style the host element itself */
          display: block;
          contain: content;
        }
        *:not(slot) {
          all: initial;
          box-sizing: border-box;
          /* content-visibility: auto; */
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

    // Efficiently replace the shadow root's content
    // templateWrapper is an HTMLCollection containing one <template> element
    this.#root.replaceChildren(...templateWrapper);

    // Get the actual <template> element we just inserted
    const newTemplateNode = this.#root.querySelector("template");

    if (!newTemplateNode) {
      // This should theoretically not happen if html`` works correctly
      log({
        message:
          `[frontend/element#buildTemplate] <${this.tagName}> template missing <template> tag after insertion, cannot update content.`,
        level: "error",
      });
      return;
    }

    // Clone the content of the <template> and append it to the shadow root
    this.#root.append(newTemplateNode.content.cloneNode(true));

    log({
      message:
        `[frontend/element#buildTemplate] <${this.tagName}> template updated`,
      level: "debug",
    });
  }

  /**
   * Resolves an attribute value from its string representation (or null/undefined)
   * to the type defined in `buildDefinition`.
   *
   * @param {keyof S} name - The name of the attribute.
   * @param {string | null | undefined} value - The raw string value from `getAttribute` or null/undefined.
   * @returns {S[keyof S] | undefined} The resolved attribute value according to its defined type, or undefined if the value is null/undefined.
   * @internal
   */
  #RESOLVE_ATTRIBUTE(
    name: keyof S,
    value: string | null | undefined,
  ): S[keyof S] | undefined {
    // Get the constructor (String, Number, Boolean) from the definition
    const resolver = this.buildDefinition[name] ?? String; // Default to String if not defined

    // If the attribute doesn't exist or is explicitly null/undefined, return undefined.
    if (value === null || value === undefined) {
      // For boolean, absence means false. For others, it means undefined.
      return resolver === Boolean ? false as S[keyof S] : undefined;
    }

    // Handle boolean attributes specifically
    if (resolver === Boolean) {
      // Presence of the attribute (even with empty string value) means true.
      // Specific string "false" means false.
      return this.#RESOLVE_BOOLEAN_ATTRIBUTE(value) as S[keyof S];
    }

    // For String and Number, attempt conversion.
    try {
      // Use the constructor (String() or Number()) to convert the value.
      return resolver(value) as S[keyof S];
    } catch (e) {
      log({
        message:
          `[frontend/element#RESOLVE_ATTRIBUTE] <${this.tagName}> failed to convert attribute "${
            String(name)
          }" value "${value}" using ${resolver.name}.`,
        detail: { error: e },
        level: "warn",
      });
      // Return undefined if conversion fails (e.g., Number("abc"))
      return undefined;
    }
  }

  /**
   * Resolves a boolean attribute value based on HTML conventions.
   * An empty string or "true" resolves to true. "false" resolves to false.
   * Any other non-empty string might be considered true depending on context,
   * but here we strictly check for "false".
   *
   * @param {string} value - The string value of the attribute.
   * @returns {boolean} The resolved boolean value.
   * @internal
   */
  #RESOLVE_BOOLEAN_ATTRIBUTE(value: string): boolean {
    // Following HTML convention: presence means true, value="false" means false.
    return value.toLowerCase() !== "false";
  }
}
