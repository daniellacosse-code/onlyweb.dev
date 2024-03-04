// @ts-check

/**
 * @name handleTemplate
 * @description Utility for handling a javascript template literals
 * @param {object} options
 * @param {string} options.template
 * @param {Array<string | string[]>} options.insertions
 * @param {(insertion: string | string[]) => string} options.handleInsertion
 * @returns {string}
 * @example const unsafeHtml = handleTemplate({
 *  template: "<div>${0}</div>",
 *  insertions: ["hello"],
 *  handleInsertion: (insertion) => insertion
 * }) // returns "<div>hello</div>"
 */
export default ({ template, insertions, handleInsertion }) =>
  insertions.reduce((result, insertion, index) => {
    let handledInsertion = "";

    if (Array.isArray(insertion)) {
      insertion.forEach((subInsertion) => {
        handledInsertion += handleInsertion(subInsertion);
      });
    } else {
      handledInsertion = handleInsertion(insertion);
    }
    return result + (template.at(index) ?? "") + handledInsertion;
  }, "") + (template.at(-1) ?? "");
