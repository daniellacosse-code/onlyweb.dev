import * as pages from "/framework/backend/pages/html.js";

export const translate = async (request) => {
  const { searchParams, pathname } = new URL(request.url);

  let lanugageCode = "en";
  let translationService;
  if (searchParams.has("lang")) {
    const requestedLang = searchParams.get("lang");

    try {
      const { default: rawTranslations } = await import(
        `/app/assets/messages/${requestedLang}.json`,
        {
          with: {
            type: "json"
          }
        }
      );

      let translationPayload = "";
      for (const [key, value] of Object.entries(rawTranslations)) {
        if (!key.startsWith(pathname)) continue;

        translationPayload += `${key.split("#")[1]}:${value};`;
      }

      lanugageCode = searchParams.get("lang");
      translationService = pages.html`<script>
        for (const [key, value] of '${translationPayload}'.split(';').map((pair) => pair.split(':'))) {
          const element = document.getElementById(key);
          if (element) {
            element.textContent = value;
          }
        }
      </script>`;
    } catch (error) {
      console.error(`Lang ${requestedLang} not supported:`, error);
    }
  }

  return { lanugageCode, translationService };
};
