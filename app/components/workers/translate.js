import { RegisterWorker } from "/framework/frontend/component/worker/register.js";

RegisterWorker({
  tag: "translate",
  source: "/app/components/workers/translate.js",
  handleEvent: (event) => {
    // TODO: move to store
    for (const [id, value] of event.detail.translations) {
      const element = document.getElementById(id);
      if (element) element.textContent = value;
    }
  }
});

export default async (request) => {
  const requestURL = new URL(request.url);
  const languageCode = requestURL.searchParams.get("lang") ?? "en";

  let translations;
  try {
    translations = await import(`/app/assets/messages/${languageCode}.json`, {
      with: {
        type: "json"
      }
    });
  } catch (error) {
    console.error(`Lang ${languageCode} not supported:`, error);

    return {};
  }

  return {
    state: { translations },
    handleMount: () =>
      this.postMessage({ translations: this.state.translations })
  };
};
