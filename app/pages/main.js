import Backend from "/framework/backend/module.js";

import * as constants from "/app/constants.js";
import OnlyWebTheme from "/app/pages/shared-theme.js";

const route = "/";

Backend.Page.Register(route, {
  handleRequest: async (request) => {
    const logoSrc =
      (request.url.origin.match(/localhost/)
        ? request.url.origin
        : constants.KEYCDN_IMAGE_ZONE_URL) +
      "/app/assets/images/logo/black.svg";

    const inliner = await Backend.Page.Inliner(request);

    return Backend.Page.Response.html`<head>
        <meta charset="utf-8" />
        <link rel="icon" href="/app/assets/images/logo/white.png" />
        <link rel="manifest" href="/app/assets/manifest.json" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />

        ${inliner.metadata({
          title: "2",
          description: inliner.message(
            "only web. only web. only web. only web. only web. only web. only web. only web. only web. only web. only web. only web"
          ),
          previewImage: "/app/assets/images/logo/black.svg",
          url: "https://onlyweb.dev/"
        })}

        ${inliner.elements(
          "/app/elements/core/loading/skeleton.js",
          "/app/elements/core/image.js",
          "/app/elements/core/link.js",
          "/app/elements/core/text.js"
        )}

        <meta
          name="theme-color"
          content="${constants.THEME_COLOR_BACKGROUND}"
        />
        ${OnlyWebTheme}

        <style>
          main {
            align-items: center;
            display: flex;
            flex-direction: column;
            min-height: 100svh;
            width: 100vw;
          }

          header {
            align-items: center;
            background: var(--color-foreground);
            box-sizing: border-box;
            color: var(--color-background);
            display: flex;
            flex-direction: column;
            flex-shrink: 0;
            justify-content: center;
            padding: var(--size-huge) 0;
            width: 100vw;
          }

          header * {
            --color-foreground: var(--color-background);
          }

          h1 {
            font-size: var(--size-huge);
            margin: 0;
          }

          article {
            box-sizing: border-box;
            color: var(--color-background);
            flex-grow: 1;
            text-align: center;
            padding: var(--size-large);
          }

          section {
            margin: var(--size-huge) 0;
            display: flex;
            flex-direction: column;
            gap: var(--size-narrow);
          }

          .logo {
            display: block;
            min-height: var(--size-icon);
          }
        </style>
      </head>
      <body>
        <main>
          <header>
            <div class="logo">
              <core-image
                alt="logo"
                height="${constants.THEME_SIZE_ICON}"
                src="${logoSrc}"
                width="${constants.THEME_SIZE_ICON}"
              ></core-image>
              <core-image
                alt="logo"
                height="${constants.THEME_SIZE_ICON}"
                src="${logoSrc}"
                width="${constants.THEME_SIZE_ICON}"
              ></core-image>
            </div>
            <core-text type="title">${inliner.message("only web 2")}</core-text>
          </header>
          <article>
            <section>
              <core-text type="subtitle"
                >${inliner.message("Please pardon our dust.")}</core-text
              >
            </section>
            <section>
              <core-text 
                >${inliner.message(
                  "We're currently rebuilding literally everything."
                )}</core-text
              >
              <core-link href="https://DanielLaCos.se/"
                >${inliner.message("Follow along")}</core-link
              >
            </section>
          </article>
        </main>
      </body>`;
  },
  handleServiceWorkerRequest: () => Backend.Page.Response.js`
    self.addEventListener("install", (event) => {
      event.waitUntil(
        caches.open("${route}").then((cache) => {
          return cache.addAll([
            "${route}",
            "/app/assets/manifest.json"
          ]);
        })
      );
    });

    self.addEventListener("fetch", (event) => {
      event.respondWith(new Promise(async (resolve) => {
        const cachedResponse = await caches.match(event.request);
        
        resolve(cachedResponse || fetch(event.request).then((networkResponse) => {
          cache.put(event.request, networkResponse.clone());

          return networkResponse;
        }));
      }));  
  })`
});
