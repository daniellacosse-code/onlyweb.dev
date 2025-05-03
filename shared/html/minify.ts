const matchInnermostHTMLComment = /<!--(?:(?!<!--)[\s\S])*?-->/;
const matchInnermostJSComment = /\/\*(?:(?!\/\*)[\s\S])*?\*\//;

/**
 * A utility for 'good-enough' minifying HTML.
 * Assumes proper semi-colons and that all content-based whitespace is outsourced or done in CSS.
 * @param text The HTML to minify.
 * @returns The minified HTML.
 * @example
 *
 * ```js
 * const html = `
 *  <div>
 *   <h1>Hello, world!</h1>
 * </div>
 * `;
 * const minifiedHtml = minifyHtml(html); // returns "<div> <h1>Hello, world!</h1> </div>"
 * ```
 */
export const minifyHtml = (text: string): string => {
  // 1. Remove single-line JS comments (must happen before removing newlines)
  let result = text.replaceAll(/(?<![:\\])\/\/.*/g, "");

  // 2. Remove multi-line HTML comments (handles nested and multi-line comments)
  while (matchInnermostHTMLComment.test(result)) {
    result = result.replace(matchInnermostHTMLComment, "");
  }
  // 3. Remove multi-line JS/CSS comments (handles nested and multi-line comments)
  while (matchInnermostJSComment.test(result)) {
    result = result.replace(matchInnermostJSComment, "");
  }
  // 4. Replace runs of whitespace (including newlines) with a single space
  result = result.replaceAll(/\s+/g, " ");

  // 5. Trim leading/trailing whitespace
  return result.trim();
};
