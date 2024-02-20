const addResourcesToCache = async (resources) => {
  const cache = await caches.open("only-cache");
  await cache.addAll(resources);
};

self.addEventListener("install", (event) => {
  event.waitUntil(
    addResourcesToCache([
      "/app/assets/images/logo.png",
      "/framework/shared/cuid.js",
      "/framework/shared/handle-template.js",
      "/framework/shared/user-agent.js",
      "/framework/shared/html/escape.js",
      "/framework/shared/html/minify.js",
      "/framework/frontend/element/html.js",
      "/framework/frontend/element/register.js",
      "/framework/frontend/store/register.js",
      "/app/constants.js",
      "/app/reload.js",
      "/app/elements/core/button.js",
      "/app/elements/core/loading/skeleton.js",
      "/app/elements/keycdn/image.js"
    ])
  );
});

self.addEventListener("fetch", (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      return response || fetch(event.request);
    })
  );
});
