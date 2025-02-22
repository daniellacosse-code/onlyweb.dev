//@ts-check
/// <reference lib="dom" />
/// <reference lib="dom.iterable" />

/**
 * A utility for creating a templateable HTMLCollection
 * @param {TemplateStringsArray} template The template
 * @param {(string | string[] | HTMLCollection)[]} insertions The insertions
 * @returns {HTMLCollection} The compiled HTMLCollection
 */
export default (template, ...insertions) => {
  // We refrain from importing the Shared library directly as that would
  // include it in the frontend bundle twice.
  /** @typedef {typeof import('../../shared/module.js').default} Shared */

  const $Shared =
    /** @type {{ $Shared: Shared }} */ (/** @type {unknown} */ (globalThis))
      .$Shared;

  const wrapper = globalThis.document.createElement("div");

  wrapper.innerHTML = $Shared.handleTemplate({
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

      return $Shared.HTML.escape(
        Array.isArray(insertion) ? insertion.join("") : String(insertion),
      );
    },
  });

  return wrapper.children;
};
