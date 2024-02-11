import { escape } from "/framework/shared/html/escape.js";

export function html(template, ...insertions) {
  const wrapper = document.createElement("div");

  wrapper.innerHTML = handleTemplate({
    template,
    insertions,
    handleInsertion: (insertion) =>
      insertion instanceof HTMLElement ? insertion.outerHTML : escape(insertion)
  });

  return wrapper.firstChild;
}
