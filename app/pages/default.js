import Backend from "/framework/backend/module.js";

import * as constants from "/app/constants.js";
import OnlyWebTheme from "/app/pages/shared-theme.js";

const route = "/";

Backend.Page.Register(route, {
  inliner: {
    messages: "/app/assets/messages"
  },
  responses: {
    handleDefault: (request, inliner) => {
      const logoSrc =
        (request.url.origin.match(/localhost/)
          ? request.url.origin
          : constants.KEYCDN_IMAGE_ZONE_URL) +
        "/app/assets/images/logo/black.svg";

      return Backend.Page.Response.html`<head>
          <meta charset="utf-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1" />
          <link rel="manifest" href="/app/assets/manifest.json" />
  
          ${inliner.metadata({
            title: "2",
            description: inliner.message(
              "only web. only web. only web. only web. only web. only web. only web. only web. only web. only web. only web. only web"
            ),
            previewImage: "/app/assets/images/root-preview.png",
            iconImage: "/app/assets/images/logo/maskable.png",
            splashImage: "/app/assets/images/logo/splash.png",
            url: "https://onlyweb.dev/"
          })}
  
          ${inliner.elements(
            "/app/elements/core/loading/skeleton.js",
            "/app/elements/core/image.js",
            "/app/elements/core/link.js",
            "/app/elements/core/text.js",
            "/app/elements/core/input.js"
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
              flex-direction: row;
              min-height: 100svh;
              width: 100vw;
            }

            nav {
              height: 100svh;
              max-width: min-content;
              display: flex;
              flex-direction: column;
              flex-shrink: 0;
              background: var(--color-foreground);
              text-align: center;
              /* padding: var(--size-narrow); */
              box-sizing: border-box;
              isolation: isolate;
            }

            nav header {
              margin: var(--size-default);
            }

            nav header core-text {
              color: var(--color-background);
              white-space: nowrap;
              --size-text-title: 1.5rem;
              flex-shrink: 0;
            }

            nav core-input {
              --color-foreground: var(--color-background);
              text-align: left;
            }

            .input-wrapper {
              padding: 0 var(--size-narrow);
            }

            nav ul {
              flex-grow: 1;
              all: initial;
              margin-top: var(--size-default);
            }

            nav ul li {
              list-style-type: none;
              padding: var(--size-narrow);
              text-align: right;
              cursor: pointer;
              user-select: none;
            }

            li.active {
              background-color: var(--color-highlight);
              color: var(--color-background);
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
          </style>
        </head>
        <body>
          <main>
          <nav>
            <header>
              <core-image src="${logoSrc}" alt="logo" width="64" height="64"></core-image>
              <core-text type="title">only web</core-text>
            </header>
            <div class="input-wrapper">
              <core-input id="search" type="search" label="Search..."></core-input>
            </div>
            <ul id="sidebar-options"></ul>
          </nav>
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
          <script type="module">
            import Frontend from "/framework/frontend/module.js";

            const sidebarMenuContents = ["Part #1", "Section #2", "Appendix #3"];

            const sidebarSearchElement = globalThis.document.getElementById("search");
            const sidebarOptionsListElement = globalThis.document.getElementById("sidebar-options");

            const renderSidebarMenuContents = (contents) => {
              sidebarOptionsListElement.replaceChildren(
                contents.map((content) => Frontend.Element.html("<li>" + content + "</li>"))
              );
            };

            renderSidebarMenuContents(sidebarMenuContents);

            sidebarSearchElement.addEventListener("input", (event) => {
              const searchValue = sidebarSearchElement.value.toLowerCase();
              const filteredContents = sidebarMenuContents.filter((content) =>
                content.toLowerCase().includes(searchValue)
              );

              renderSidebarMenuContents(filteredContents);
            });
          </script>
        </body>`;
    },
    handleServiceWorker: () => Backend.Page.Response.js`
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
        event.respondWith(caches.open("${route}").then((cache) => {
          return cache.match(event.request).then((cachedResponse) => {
            const fetchedResponse = fetch(event.request).then((networkResponse) => {
              cache.put(event.request, networkResponse.clone());
  
              return networkResponse;
            });
  
            return cachedResponse || fetchedResponse;
          });
        }));
      });`
  }
});
