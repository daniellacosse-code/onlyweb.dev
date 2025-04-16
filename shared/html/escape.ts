const escapedCharacters = new Map([
  ["&", "&amp;"],
  ["<", "&lt;"],
  [">", "&gt;"],
  ["'", "&#39;"],
  ['"', "&quot;"]
]);

/**
 * A utility for escaping raw HTML.
 * @param html The raw HTML.
 * @returns The escaped HTML.
 * @example 
 * 
 * ```js
 * const unsafeHtml = "<div>hello</div>";
 * const safeHtml = escape(unsafeHtml); // returns "&lt;div&gt;hello&lt;/div&gt;"
 * ```
 */
export const escape = (html: string): string => {
  let result = "";

  for (const char of String(html)) {
    result += escapedCharacters.get(char) ?? char;
  }

  return result;
};