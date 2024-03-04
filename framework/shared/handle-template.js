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
    return result + template.at(index) + handledInsertion;
  }, "") + template.at(-1);
