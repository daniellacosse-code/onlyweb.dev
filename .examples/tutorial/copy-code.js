// @ts-check
/// <reference lib="dom" />

/**
 * @fileoverview
 * This file defines the `<copy-code>` custom element using the OnlyWeb frontend framework.
 *
 * Purpose:
 * This element displays a piece of code (passed via the 'code' attribute)
 * inside a button. When the button is clicked, the code is copied to the
 * clipboard, and a confirmation message (passed via the 'copy-message' attribute)
 * is briefly shown using the Popover API.
 *
 * Key Concepts Demonstrated:
 * - Registering a custom element (`registerElement`).
 * - Defining observed attributes and their types (`attributes`).
 * - Using the `mount` lifecycle callback for setup (adding event listeners).
 * - Using the `render` lifecycle callback to define the element's structure and style.
 * - Accessing attribute values via `this.buildAttributes` (implicitly used in `render` parameters).
 * - Using the `html` tagged template literal for defining the element's shadow DOM.
 * - Interacting with standard browser APIs (Clipboard API, Popover API).
 */

import { html, registerElement } from "@onlyweb/frontend";
import { logError } from "@onlyweb/shared";

/**
 * Registers the custom element `<copy-code>` with the browser.
 */
registerElement("copy-code", {
  /**
   * Defines the attributes that this element will react to.
   * - `copy-message`: Expects a string value for the popover confirmation text.
   * - `code`: Expects a string value representing the code to be displayed and copied.
   */
  attributes: { ["copy-message"]: String, code: String },

  /**
   * Lifecycle callback executed after the element is connected to the DOM
   * and the initial `render` has completed.
   */
  mount() {
    // Find the popover element within this component's shadow DOM.
    const popover = this.querySelector("#copy-message-popover");

    // Ensure the popover is hidden initially when the element mounts.
    // The `?` (optional chaining) prevents errors if the element isn't found immediately.
    popover?.hidePopover();

    // Add a click event listener to the host element (`<copy-code>` itself).
    // Using `this.addEventListener` ensures the listener is automatically cleaned up
    // when the element is removed from the DOM (a feature of OWFElement base class).
    this.addEventListener("click", async () => {
      // Access the 'code' attribute value using `this.buildAttributes`.
      // `this.buildAttributes` is a proxy that provides typed access to observed attributes.
      const codeToCopy = String(this.buildAttributes.code ?? ""); // Ensure it's a string, default to empty

      try {
        // Use the browser's Clipboard API to write the code text to the clipboard.
        await globalThis.navigator.clipboard.writeText(codeToCopy);

        // If copying is successful, show the popover confirmation message.
        popover?.showPopover();
      } catch (err) {
        // Log an error if writing to the clipboard fails (e.g., due to permissions).
        // Check if the caught error is an instance of Error
        if (err instanceof Error) {
          // Log the specific error if writing to the clipboard fails
          logError(err);
        } else {
          // Handle cases where the caught value is not an Error object
          // Log a generic error message, potentially wrapping the unknown value
          logError(
            new Error(
              `An unexpected error occurred during copy: ${String(err)}`,
            ),
          );
        }
        // Optionally, provide user feedback about the failure here.
      }
    });
  },

  /**
   * Lifecycle callback that generates the HTML structure and styling
   * for the element's shadow DOM.
   */
  render({ code, ["copy-message"]: copyMessage }) {
    // Use the `html` tagged template literal to define the shadow DOM content.
    // This handles efficient rendering and updates.
    return html`
    <style>
      /* Scoped styles applied only within this custom element's shadow DOM */
      button {
        cursor: pointer;
        padding: 0.5em 1em;
        border: 1px solid #ccc;
        border-radius: 4px;
        background-color: #f8f8f8;
        display: inline-block;
        max-width: 100%;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
      code {
        font-family: monospace;
        font-size: 1rem;
        display: inline-block;
        max-width: 100%;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        vertical-align: middle;
      }
      /* Style for the popover element */
      div[popover] {
        all: revert;
        border: 1px solid #ccc;
        padding: 0.5em;
        background-color: lightyellow;
        border-radius: 3px;
        /* Basic popover styling */
        box-shadow: 0 2px 5px rgba(0,0,0,0.2);
      }
    </style>
    <!--
      The button element that displays the code.
      'popovertarget' connects this button to the popover div, making it the
      invoking element for showing/hiding the popover.
    -->
    <button popovertarget="copy-message-popover">
      <code>${
      String(code ?? "")
    }</code> <!-- Display the code attribute value -->
    </button>
    <!--
      The popover element itself.
      'id' is used to link it via 'popovertarget'.
      'popover' attribute enables the Popover API behavior.
    -->
    <div id="copy-message-popover" popover>${
      String(copyMessage ?? "Copied!")
    }</div> <!-- Display the copy-message attribute value -->
  `;
  },
});
