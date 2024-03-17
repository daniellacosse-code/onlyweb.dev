//@ts-check
/// <reference lib="dom" />
/// <reference lib="dom.iterable" />

import escape from "/framework/shared/html/escape.js";
import handleTemplate from "/framework/shared/handle-template.js";

/**
 * A utility for creating a templateable HTMLCollection
 * @param {TemplateStringsArray} template The template
 * @param {(string | string[] | HTMLCollection)[]} insertions The insertions
 * @returns {HTMLCollection} The compiled HTMLCollection
 */
export default (template, ...insertions) => {
  const wrapper = globalThis.document.createElement("div");

  wrapper.innerHTML = handleTemplate({
    template,
    insertions,
    handleInsertion: (insertion) => {
      if (insertion instanceof HTMLCollection) {
        let collectionHTML = "";
        for (const element of insertion) collectionHTML += element.outerHTML;

        return collectionHTML;
      }

      if (insertion instanceof HTMLElement) return insertion.outerHTML;

      return escape(
        Array.isArray(insertion) ? insertion.join("") : String(insertion)
      );
    }
  });

  return wrapper.children;
};
