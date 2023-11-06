export const escape = (html: string) =>
  html.replaceAll(/</g, "&lt;").replaceAll(/>/g, "&gt;");

export default (template: TemplateStringsArray, ...insertions: (string | number | Response)[]) =>
  new Response(template.reduce(
    (result, templateFragment, index) => {
      let insertion: string;

      if (insertions[index] instanceof Response) {
        // TODO: handle this case properly (perhaps with an HTMLResponse class)
        insertion = (insertions[index] as Response).body ?? "";
      } else {
        insertion = String(insertions[index] ?? "");
      }

      return `${result}${templateFragment}${insertion}`;
    },
    ""
  ), {
    status: 200,
    headers: {
      'content-type': 'text/html; charset=UTF-8',
    }
  });
