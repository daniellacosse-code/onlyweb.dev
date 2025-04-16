export type TemplateLiteralParameters<T> = {
  /**
   * The template
   */
  template: TemplateStringsArray;

  /**
   * The items to insert into the template
   */
  insertions: T[];

  /**
   * The function to handle the insertions
   */
  handleInsertion: (insertion: T) => string;
}

/**
 * Utility for handling a javascript template literals
 * @param parameters The template literal parameters
 * @returns The compiled template
 * @example
 *
 * ```js
 * const unsafeHtml = handle({
 *  template: ["<div>", "</div>"],
 *  insertions: ["hello"],
 *  handleInsertion: (insertion) => insertion
 * }) 
 * 
 * const message = "hello";
 * 
 * const result = unsafeHtml`<div>${message}</div>`;
 * // "<div>hello</div>"
 * ```
 */
export const handle = <T>(
  {
    template, 
    insertions, 
    handleInsertion 
  }: TemplateLiteralParameters<T>
): string =>
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
