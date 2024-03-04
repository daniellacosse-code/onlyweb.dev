// @ts-check

const escapedCharacters = new Map([
  ["&", "&amp;"],
  ["<", "&lt;"],
  [">", "&gt;"],
  ["'", "&#39;"],
  ['"', "&quot;"]
]);

/**
 * @name escape
 * @description A utility for escaping raw HTML
 * @param {string} html
 * @returns {string}
 * @example const unsafeHtml = "<div>hello</div>";
 * const safeHtml = escape(unsafeHtml); // returns "&lt;div&gt;hello&lt;/div&gt;"
 */
export default (html) => {
  let result = "";

  for (const char of String(html)) {
    result += escapedCharacters.get(char) ?? char;
  }

  return result;
};
