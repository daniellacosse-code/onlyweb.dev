import escape from "/framework/shared/html/escape.js";
import handleTemplate from "/framework/shared/handle-template.js";

/**
 * A utility for creating a templateable HTMLCollection
 * @param {string} template The template
 * @param {(string | string[])[]} insertions The insertions
 * @returns {HTMLCollection} The compiled HTMLCollection
 */
export default (template, ...insertions) => {
  const wrapper = document.createElement("div");

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

      return escape(insertion);
    }
  });

  return wrapper.children;
};
