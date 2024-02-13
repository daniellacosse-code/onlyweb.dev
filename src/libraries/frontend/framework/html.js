import { escape } from "../../shared/html/escape.js";

export function html(template, ...insertions) {
  const wrapper = document.createElement("div");

  wrapper.innerHTML =
    insertions.reduce((result, insertion, index) => {
      const templateFragment = template.at(index);

      insertion =
        insertion instanceof HTMLElement
          ? insertion.outerHTML
          : escape(insertion);

      return result + templateFragment + insertion;
    }, "") + template.at(-1);

  return wrapper.firstChild;
}