// @ts-check

/**
 * Utility for handling a javascript template literals
 * @param {object} options The options
 * @param {TemplateStringsArray} options.template The template
 * @param {Array<any>} options.insertions The items to insert into the template
 * @param {(insertion: any) => string} options.handleInsertion The function to handle the insertions
 * @returns {string} The compiled template
 * @example const unsafeHtml = handleTemplate({
 *  template: ["<div>", "</div>"],
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
