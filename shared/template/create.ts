/**
 * Processes the components of a JavaScript template literal (the static strings
 * and the dynamic insertions) to construct a final string. It allows for
 * custom handling of each inserted value before it's added to the result.
 *
 * This function essentially reconstructs the string that a tagged template
 * literal would produce, but gives control over the processing of insertions.
 *
 * @template T The type of the values being inserted into the template.
 * @param {TemplateCreationOptions<T>} options - An object containing the template parts and the insertion handler.
 * @param {TemplateStringsArray} options.template - The array of static string parts from the template literal.
 * @param {T[]} options.insertions - The array of evaluated expressions (insertions) from the template literal.
 * @param {(insertion: T) => string} options.handleInsertion - A function that takes an insertion value and returns its string representation to be included in the final output.
 * @returns {string} The fully constructed string with handled insertions.
 * @example
 *
 * ```js
 * const options = {
 *   template: ["<div>", " and ", "!</div>"], // Corresponds to `<div>${...} and ${...}!</div>`
 *   insertions: ["hello", "world"],
 *   handleInsertion: (insertion) => insertion.toUpperCase() // Example: Convert insertions to uppercase
 * };
 *
 * const result = createTemplate(options);
 * console.log(result); // "<div>HELLO and WORLD!</div>"
 * ```
 *
 * @example Handling arrays within insertions
 * ```js
 * const optionsWithArray = {
 *   template: ["List: ", ""], // Corresponds to `List: ${...}`
 *   insertions: [ ['item1', 'item2'] ], // Note the nested array
 *   handleInsertion: (item) => `<li>${item}</li>`
 * };
 *
 * const listResult = createTemplate(optionsWithArray);
 * console.log(listResult); // "List: <li>item1</li><li>item2</li>"
 * ```
 */
export const createTemplate = <T>(
  {
    template,
    insertions,
    handleInsertion,
  }: TemplateCreationOptions<T>,
): string =>
  // Start with an empty string and iteratively build the result.
  insertions.reduce((result, insertion, index) => {
    let handledInsertion = "";

    // Handle cases where an insertion might itself be an array of items to process.
    if (Array.isArray(insertion)) {
      insertion.forEach((subInsertion) => {
        // Apply the handler to each sub-item.
        handledInsertion += handleInsertion(subInsertion);
      });
    } else {
      // Apply the handler to the single insertion item.
      handledInsertion = handleInsertion(insertion);
    }
    // Append the static template part followed by the handled insertion(s).
    // `template.at(index)` gets the string part *before* the current insertion.
    return result + (template.at(index) ?? "") + handledInsertion;
  }, "") + // Start with an empty accumulator.
  // Append the final static string part (the one after the last insertion).
  (template.at(-1) ?? "");

/**
 * Defines the structure for the options required by the `createTemplate` function.
 * @template T The type of the values being inserted into the template.
 */
export type TemplateCreationOptions<T> = {
  /**
   * The array of static string segments from a template literal.
   * For a template like `a${b}c${d}e`, this would be `['a', 'c', 'e']`.
   */
  template: TemplateStringsArray;

  /**
   * An array containing the evaluated values of the expressions `${...}`
   * embedded within the template literal.
   * For `a${b}c${d}e`, this would be `[b, d]`. Each element can be of type T,
   * or potentially an array of T if the logic handles nested structures.
   */
  insertions: (T | T[])[]; // Adjusted to reflect the handling of arrays in createTemplate

  /**
   * A callback function responsible for converting each insertion value
   * (or sub-value if an insertion is an array) into a string suitable for
   * concatenation into the final result. This allows for custom formatting,
   * escaping, or transformation.
   * @param insertion - An individual value of type T to be processed.
   * @returns The string representation of the insertion.
   */
  handleInsertion: (insertion: T) => string;
};
