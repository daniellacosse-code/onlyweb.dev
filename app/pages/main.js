import BackendPage from "/framework/backend-page/entry.js";

import * as constants from "/app/constants.js";
import sharedTheme from "/app/pages/shared-theme.js";

const route = "/";

BackendPage.Register(route, {
  handleRequest: (request) => {
    const html = BackendPage.Response("text/html");
    return html`<head>
        <meta charset="utf-8" />
        <link rel="icon" href="/app/assets/images/logo/white.png" />
        <link rel="manifest" href="/app/assets/manifest.json" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta
          name="theme-color"
          content="${constants.THEME_COLOR_BACKGROUND}"
        />

        ${BackendPage.Inline.metadata({
          title: "2",
          description:
            "only web. only web. only web. only web. only web. only web. only web. only web. only web. only web. only web. only web",
          previewImage: "/app/assets/images/logo/black.svg",
          url: "https://onlyweb.dev/"
        })}
        ${sharedTheme}

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
                src="/app/assets/images/logo/black.svg"
                width="${constants.THEME_SIZE_ICON}"
                origin="${request.url.origin === "http://localhost:8000"
                  ? request.url.origin
                  : constants.KEYCDN_IMAGE_ZONE_URL}"
              ></core-image>
              <core-image
                alt="logo"
                height="${constants.THEME_SIZE_ICON}"
                src="/app/assets/images/logo/black.svg"
                width="${constants.THEME_SIZE_ICON}"
                origin="${request.url.origin === "http://localhost:8000"
                  ? request.url.origin
                  : constants.KEYCDN_IMAGE_ZONE_URL}"
              ></core-image>
            </div>
            <core-text id="title" kind="title">only web 2</core-text>
          </header>
          <article>
            <section>
              <core-text id="apology" kind="subtitle"
                >Please pardon our dust.</core-text
              >
            </section>
            <section>
              <core-text id="explaination"
                >We're currently rebuilding literally everything.</core-text
              >
              <core-link id="call-to-action" href="https://DanielLaCos.se"
                >Follow along</core-link
              >
            </section>
          </article>
        </main>

        <translation-helper code="${request.language}"></translation-helper>
        <reload-helper></reload-helper>

        ${BackendPage.Inline.elements(
          request.url.origin,
          "/app/elements/core/loading/skeleton.js",
          "/app/elements/core/image.js",
          "/app/elements/core/link.js",
          "/app/elements/core/text.js",
          "/app/elements/helpers/reload.js",
          "/app/elements/helpers/translate.js"
        )}
      </body>`;
  },
  handleServiceWorkerRequest: () => BackendPage.Response("text/javascript")`
    self.addEventListener("fetch", async ({ request }) => {
      let response = await caches.match(request);

      if (!response) {
        response = await fetch(request);

        const cache = await caches.open("${route}");
        cache.put(request, response.clone());
      }

      event.respondWith(
        (async () => response)()
      );
    });`
});
