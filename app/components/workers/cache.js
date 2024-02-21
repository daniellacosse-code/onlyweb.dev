import { RegisterWorker } from "/framework/frontend/component/worker/register.js";

const tag = "cache-v0";

RegisterWorker({
  tag,
  source: "/app/components/workers/cache.js"
});

export default () => ({
  state: { tag },
  handleMount: async () => {
    const cache = await caches.open(this.state.tag);

    // await cache.delete();

    return cache.addAll([
      "/framework/shared/cuid.js",
      "/framework/shared/handle-template.js",
      "/framework/shared/user-agent.js",
      "/framework/shared/html/escape.js",
      "/framework/shared/html/minify.js",
      "/framework/frontend/element/html.js",
      "/framework/frontend/element/register.js",
      "/framework/frontend/store/register.js",
      "/app/assets/images/logo.png",
      "/app/elements/core/button.js",
      "/app/elements/core/loading/skeleton.js",
      "/app/elements/keycdn/image.js"
    ]);
  },
  handleEvent: async (event) => {
    const cache = await caches.open(this.context.tag);
    const response = await cache.match(event.request);

    if (!response) return null;

    return response;
  }
});
