import { htmlEscape, templateCreate } from "@onlyweb/shared";

/**
 * A utility for creating a templateable HTMLCollection
 * @param template The template
 * @param insertions The insertions
 * @returns The compiled HTMLCollection
 * @example
 * 
 * ```js
 * const message = "Hello, World!";
 * 
 * html`<div>${message}</div>`
 * ```
 */
export const html = (
  template: TemplateStringsArray,
  ...insertions: (string | string[] | HTMLCollection)[]
): HTMLCollection => {
  const wrapper = globalThis.document.createElement("div");

  wrapper.innerHTML = templateCreate({
    template,
    insertions,
    handleInsertion: (insertion) => {
      if (insertion instanceof HTMLCollection) {
        let collectionHTML = "";
        for (const element of insertion) collectionHTML += element.outerHTML;

        return collectionHTML;
      }

      if (insertion instanceof HTMLElement) return insertion.outerHTML;

      return htmlEscape(
        Array.isArray(insertion) ? insertion.join("") : String(insertion),
      );
    },
  });

  return wrapper.children;
};
