import HTMLResponse from "./response.ts";
import { escape } from "./escape.ts";

export default (template: TemplateStringsArray, ...insertions: (HTMLResponse | string | number)[]) =>
  new HTMLResponse(
    insertions.reduce<string>((result, insertion, index) => {
      const templateFragment = template.at(index);

      insertion = insertion instanceof HTMLResponse
        ? insertion.html
        : escape(insertion);

      return result + templateFragment + insertion;
    }, "") + template.at(-1)
  );
