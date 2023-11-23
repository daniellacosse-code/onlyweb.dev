import { escape } from "./escape.js";

export const html = (template, ...insertions) =>
  new HTMLElement(
    insertions.reduce <
      string >
      ((result, insertion, index) => {
        const templateFragment = template.at(index);

        insertion =
          insertion instanceof HTMLElement
            ? insertion.innerHTML
            : escape(insertion);

        return result + templateFragment + insertion;
      },
      "") +
        template.at(-1)
  );
