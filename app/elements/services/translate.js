import * as Frontend from "/framework/frontend/main.js";

Frontend.Element.Register({
  tag: "translation-service",
  attributes: {
    code: String
  },
  async handleRender({ code = "en" }) {
    try {
      const messages = await import(`/app/assets/messages/${code}.json`, {
        with: {
          type: "json"
        }
      });

      for (const [key, value] of Object.entries(messages.default)) {
        const [keyPath, elementID] = key.split("#");
        if (location.path !== keyPath) continue;

        const element = this.querySelector(`#${elementID}`);

        if (element) element.textContent = value;
      }
    } catch {
      console.error(`Lang ${code} not supported`);
    }
  }
});
