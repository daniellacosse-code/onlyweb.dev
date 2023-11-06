export const escape = (html: string) =>
  html.replaceAll(/</g, "&lt;").replaceAll(/>/g, "&gt;");

export default (template: TemplateStringsArray, ...insertions: (string | number)[]) =>
  template.reduce(
    (result, templateFragment, index) =>
      `${result}${templateFragment}${escape(String(insertions[index] ?? ""))}`,
    ""
  );
