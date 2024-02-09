// TODO: reuse this file in the backend
const escapedCharacters = new Map([
  ["&", "&amp;"],
  ["<", "&lt;"],
  [">", "&gt;"],
  ["'", "&#39;"],
  ['"', "&quot;"]
]);

const escape = (html) => {
  let result = "";

  for (const char of String(html)) {
    result += escapedCharacters.get(char) ?? char;
  }

  return result;
};

Framework.html = function (template, ...insertions) {
  const wrapper = document.createElement("div");

  wrapper.innerHTML =
    insertions.reduce((result, insertion, index) => {
      const templateFragment = template.at(index);

      insertion =
        insertion instanceof HTMLElement
          ? insertion.innerHTML
          : escape(insertion);

      return result + templateFragment + insertion;
    }, "") + template.at(-1);

  return wrapper.firstChild;
};
