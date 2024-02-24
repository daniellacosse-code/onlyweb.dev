import * as FrontendElement from "/framework/frontend-element/main.js";

FrontendElement.Register({
  tag: "translation-service",
  attributes: {
    code: String
  },
  async handleRender({ code = "en" }) {
    try {
      const messages = await (
        await fetch(`/app/assets/messages/${code}.json`)
      ).json();

      debugger;
      for (const [key, value] of Object.entries(messages)) {
        const [keyPath, elementID] = key.split("#");
        if (location.path !== keyPath) continue;

        const element = this.querySelector(`#${elementID}`);

        if (element) element.textContent = value;
      }
    } catch (error) {
      console.error(`Language "${code}" not supported.`, error);
    }
  }
});
