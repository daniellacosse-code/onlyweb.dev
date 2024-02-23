import * as Page from "/framework/backend/page/html.js";

export const translate = async (request) => {
  const requestURL = new URL(request.url);

  const result = {
    // TODO(#134): support accept-language request header
    code: requestURL.searchParams.get("lang") ?? "en",
    service: Page.html`<script></script>`
  };

  try {
    // "module" is a reserved word
    const mod_ule = await import(`/app/assets/messages/${result.code}.json`, {
      with: {
        type: "json"
      }
    });

    // we have to serialize it this way to avoid
    // escaping JSON characters in the HTML
    const payload = Object.entries(mod_ule.default).reduce(
      (reduction, [key, value]) => {
        const [keyPath, elementID] = key.split("#");

        if (!keyPath.startsWith(requestURL.pathname)) return reduction;

        return reduction + `${elementID}:${value};`;
      },
      ""
    );

    result.service = Page.html`<script>
      '${payload}'.split(';').forEach((pair) => {
        const [id, value] = pair.split(':');
        const element = document.getElementById(id);
        if (element) element.textContent = value;
      });
    </script>`;
  } catch (error) {
    console.error(`Lang ${result.code} not supported:`, error);
  }

  return result;
};
