import { createTemplate, escapeHtml } from "@onlyweb/shared";

/**
 * A tagged template literal function for creating safe and dynamic HTML content.
 *
 * It processes a template literal, handling various types of insertions:
 * - Primitive values (string, number) are automatically escaped using `escapeHtml`.
 * - Arrays of strings are joined and then escaped.
 * - `HTMLElement` instances are inserted directly via their `outerHTML`.
 * - `HTMLCollection` instances are iterated, and each element's `outerHTML` is inserted.
 *
 * The resulting HTML string is then parsed into an `HTMLCollection`.
 *
 * @param {TemplateStringsArray} template - The static string parts of the template literal.
 * @param {...(number | string | string[] | HTMLElement | HTMLCollection)} insertions - The dynamic values to insert into the template.
 * @returns {HTMLCollection} An `HTMLCollection` containing the DOM nodes generated from the processed template.
 * @example Basic Usage
 * ```js
 * const message = "Hello, World!";
 * const title = "Greeting";
 * const content = html`<h1 title="${title}">${message}</h1>`;
 * // content will be an HTMLCollection containing the <h1> element.
 * // 'message' and 'title' will be properly escaped if they contain HTML special characters.
 * ```
 * @example Inserting Elements and Arrays
 * ```js
 * const items = ["Item 1", "Item 2"];
 * const header = document.createElement('h2');
 * header.textContent = 'List Header';
 *
 * const list = html`
 *   ${header}
 *   <ul>
 *     ${items.map(item => `<li>${item}</li>`)}
 *   </ul>
 * `;
 * // list will contain the <h2> element followed by the <ul> element.
 * // The array returned by map() will be joined and escaped.
 * ```
 */
export const html = (
  template: TemplateStringsArray,
  ...insertions: (number | string | string[] | HTMLElement | HTMLCollection)[]
): HTMLCollection => {
  const wrapper = globalThis.document.createElement("div");

  wrapper.innerHTML = createTemplate({
    template,
    insertions,
    handleInsertion: (insertion) => {
      if (insertion instanceof HTMLCollection) {
        let collectionHTML = "";
        for (const element of insertion) collectionHTML += element.outerHTML;

        return collectionHTML;
      }

      if (insertion instanceof HTMLElement) return insertion.outerHTML;

      return escapeHtml(
        Array.isArray(insertion) ? insertion.join("") : String(insertion),
      );
    },
  });

  return wrapper.children;
};
