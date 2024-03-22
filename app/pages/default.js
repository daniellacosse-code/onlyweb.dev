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
              background: var(--color-foreground);
              display: flex;
              flex-direction: column;
              flex-shrink: 0;
              height: 100svh;
              max-width: min-content;
              text-align: center;
              transform: translateX(0%);
              transition: transform var(--animation-duration) var(--animation-timing-function);
              will-change: transform;
            }

            nav header {
              margin: var(--size-default);
            }

            nav header core-text {
              --color-foreground: var(--color-background);
              --size-text-title: 1.5rem;
              flex-shrink: 0;
              white-space: nowrap;
            }

            nav core-input {
              --color-foreground: var(--color-background);
              text-align: left;
            }

            .input-wrapper {
              padding: 0 var(--size-narrow);
            }

            nav ul {
              all: initial;
              flex-grow: 1;
              margin-top: var(--size-default);
            }

            nav ul li {
              list-style-type: none;
            }

            nav ul li a {
              all: initial;
              cursor: pointer;
              cursor: pointer;
              display: block;
              padding: var(--size-narrow);
              text-align: right;
              transition: background-color var(--animation-duration-fast) var(--animation-timing-function);
              user-select: none;
            }

            nav ul li a:hover {
              background-color: var(--color-highlight);
              color: var(--color-background);
            }

            article {
              box-sizing: border-box;
              color: var(--color-background);
              flex-grow: 1;
              padding: var(--size-large);
              text-align: center;
              will-change: width;
            }
  
            section {
              display: flex;
              flex-direction: column;
              gap: var(--size-narrow);
              margin: var(--size-huge) 0;
            }

            @media screen and (max-width: 768px) {
              nav {
                transform: translateX(calc(var(--size-narrow) - 100%));
                position: fixed;
                top: 0;
              }

              nav:hover, nav:focus-within, nav:active {
                transform: translateX(0%);
              }
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

            const sidebarMenuContents = [
              { content: "Part #1", href: "#part-1" },
              { content: "Section #2", href: "#section-2" },
              { content: "Appendix #3", href: "#appendix-3" }
            ];

            const sidebarSearchElement = globalThis.document.getElementById("search");
            const sidebarOptionsListElement = globalThis.document.getElementById("sidebar-options");

            const renderSidebarMenuContents = (contents) => {
              sidebarOptionsListElement.replaceChildren(
                // TODO(#195): how do I/can I/should I nest templates?
                ...contents.flatMap(({href, content}) => Array.from(Frontend.Element.html(["<li><a href='", "'>", "</a></li>"], href, content)))
              );
            };

            renderSidebarMenuContents(sidebarMenuContents);

            sidebarSearchElement.addEventListener("input", (event) => {
              requestAnimationFrame(() => {
                const searchValue = sidebarSearchElement.value.toLowerCase();
                const filteredContents = sidebarMenuContents.filter(({content}) =>
                  content.toLowerCase().startsWith(searchValue)
                );
  
                renderSidebarMenuContents(filteredContents);
              })
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
