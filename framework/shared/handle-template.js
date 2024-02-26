export default ({ template, insertions, handleInsertion }) =>
  insertions.reduce(
    (result, insertion, index) =>
      result + template.at(index) + handleInsertion(insertion),
    ""
  ) + template.at(-1);
