//@ts-check

import * as Shared from "@onlyweb/shared";

/**
 * A utility for creating a templateable HTMLCollection
 * @param {TemplateStringsArray} template The template
 * @param {(string | string[] | HTMLCollection)[]} insertions The insertions
 * @returns {HTMLCollection} The compiled HTMLCollection
 */
export default (template, ...insertions) => {
  const wrapper = globalThis.document.createElement("div");

  wrapper.innerHTML = Shared.handleTemplate({
    template,
    insertions,
    handleInsertion: (
      /** @type {string | string[] | HTMLCollection} */ insertion,
    ) => {
      if (insertion instanceof HTMLCollection) {
        let collectionHTML = "";
        for (const element of insertion) collectionHTML += element.outerHTML;

        return collectionHTML;
      }

      if (insertion instanceof HTMLElement) return insertion.outerHTML;

      return Shared.HTML.escape(
        Array.isArray(insertion) ? insertion.join("") : String(insertion),
      );
    },
  });

  return wrapper.children;
};
