// @ts-check

/**
 * A utility for 'good-enough' minifying HTML.
 * Assumes proper semi-colons and that all content-based whitespace is outsourced or done in CSS.
 * @param {string} text The HTML to minify.
 * @returns {string} The minified HTML.
 * @example const html = `
 *  <div>
 *   <h1>Hello, world!</h1>
 * </div>
 * `;
 * const minifiedHtml = minify(html); // returns "<div><h1>Hello, world!</h1></div>"
 */
export default (text) => {
  return (
    text
      // remove single-line JS comments, but not URLs or regexes
      // (can't do this after newlines are removed)
      .replaceAll(/[^\:\\]\/\/.*/g, "")

      // replace runs of whitespace with one space,
      // including newlines
      .replaceAll(/\s+/g, " ")

      // replace multiline comments
      // (now single line thanks to the above)
      .replaceAll(/<\!--.*?-->|\/\*.*?\*\//g, "")
      .trim()

    // there are more spaces you could remove
    // but it might fuck up weird copy -
    // it's "good enough" for me!
  );
};
