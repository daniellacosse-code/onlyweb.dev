import { createInliner, html, js, registerPage } from "@onlyweb/backend";

import * as constants from "../constants.ts";
import OnlyWebTheme from "./shared-theme.ts";

const route = "/";

registerPage(route, {
  handleRequest: async (request) => {
    const inliner = await createInliner(
      request,
      { messagesFolder: "/assets/messages" },
    );

    const logoSrc = (request.parsedUrl.origin.match(/localhost/)
      ? request.parsedUrl.origin
      : constants.KEYCDN_IMAGE_ZONE_URL) +
      "/assets/images/logo/black.svg";

    const inverseLogoSrc = (request.parsedUrl.origin.match(/localhost/)
      ? request.parsedUrl.origin
      : constants.KEYCDN_IMAGE_ZONE_URL) +
      "/assets/images/logo/white.svg";

    return html`<head>
      <meta charset="utf-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <link rel="manifest" href="/assets/manifest.json" />

      ${
      inliner.metadata({
        title: "2",
        description: inliner.message(
          "only web. only web. only web. only web. only web. only web. only web. only web. only web. only web. only web. only web",
        ),
        previewImagePath: "/assets/images/root-preview.png",
        iconImagePath: "/assets/images/logo/maskable.png",
        splashImagePath: "/assets/images/logo/splash.png",
        canonicalUrl: "https://onlyweb.dev/",
      })
    }

      ${
      await inliner.elements(
        "/elements/core/loading/skeleton.ts",
        "/elements/core/image.ts",
        "/elements/core/link.ts",
        "/elements/core/text.ts",
        "/elements/core/input.ts",
        "/elements/demo/frame.ts",
        "/elements/demo/link.ts",
      )
    }

      <meta
        name="theme-color"
        content="${constants.THEME_COLOR_BACKGROUND}"
      />
      ${OnlyWebTheme}

      <style>
        main {
          display: flex;
          flex-direction: row;
          min-height: 100svh;
          width: 100vw;
        }

        nav {
          background: var(--color-foreground);
          position: sticky;
          top: 0;
          display: flex;
          flex-direction: column;
          flex-shrink: 0;
          height: 100vh;
          max-width: min-content;
          text-align: center;
          transform: translateX(0%);
          transition: transform var(--animation-duration) var(--animation-timing-function);
          will-change: transform;
          z-index: 1;
        }

        nav header {
          margin: var(--size-default);
        }

        nav header core-text {
          --core-text-color-title: var(--color-background);
          --core-text-size-title: 1.5rem;
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
          display: block;
          font-family: system-ui;
          padding: var(--size-narrow);
          padding-left: var(--size-large);
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
          flex-grow: 1;
          padding: var(--size-large);
          will-change: width;
        }

        section {
          display: flex;
          flex-direction: column;
          gap: var(--size-narrow);
          margin: var(--size-huge) 0;
        }

        article section header {
          display: flex;
          align-items: center;
          gap: 3px;
        }

        article section header core-text {
          white-space: nowrap;
        }

        hr { 
          width: 100%;
        }

        @media screen and (max-width: 768px) {
          nav {
            transform: translateX(calc(var(--size-narrow) - 100%));
            position: fixed;
            top: 0;
          }

          nav.open, nav:hover {
            transform: translateX(0%);
          }
        }
      </style>
    </head>
    <body>
      <main>
      <nav id="sidebar">
        <header>
          <core-image class="__bootstrap-cls__" src="${logoSrc}" alt="logo" width="64px" height="64px"></core-image>
          <core-text class="__bootstrap-cls__" type="title" style="font-weight: bold; font-size: 1.5rem;">${
      inliner.message(
        "only web 2",
      )
    }</core-text>
        </header>
        <div class="input-wrapper">
          <core-input id="search" type="search" label="Search..."></core-input>
        </div>
        <ul id="sidebar-options"></ul>
      </nav>
        <article>
          <section>
            <header>
              <core-image class="__bootstrap-cls__" src="${inverseLogoSrc}" alt="logo" width="96px" height="96px"></core-image>
              <core-text class="__bootstrap-cls__" type="title">nly web</core-text>
            </header>
            <core-text type="paragraph">
              <i>[pre-alpha]</i><br/><br/>
              <b>Discover the potential of only web.</b>
              Explore cutting-edge capabilities, challenging the need for a native app for every experience.
              <i>Get ready to rethink what's possible online.</i>
            </core-text>
          </section>
          <section>
            <hr />
          </section>
          <section>
            <demo-link id="synthesizer"
              title="Audio: Synthesizer ↗️"
              author="Ableton"
              src="https://learningsynths.ableton.com/en/playground"
            >
              <core-text>
                <b>Unleash your inner musician with Ableton's web-based synthesizer.</b> Dive deep into sound creation with multiple oscillators, filters, and envelopes at your fingertips. Compose melodies using your keyboard, and then download your masterpiece to share with the world.
              </core-text>
            </demo-link>
          </section>
          <section>
            <demo-frame id="chord-reader"
              title="Audio: Chord Reader Prototype"
              src="/demos/music"
              height=600
            >
              <core-text>
                <b>Uncover the magic behind your favorite tunes with our interactive chord progression tool.</b> Simply input your desired chord sequence and hear how it sounds. It's the perfect way to experiment with different chord combinations, understand music structure, and even start creating your own compositions.
              </core-text>
            </demo-frame>
          </section>
          <section>
            <demo-frame id="diablo"
              title="Web Assembly: Diablo"
              src="https://d07riv.github.io/diabloweb/"
              height=650
              author="d07riv"
            >
              <core-text>
                <b>Relive the classic dungeon-crawling experience, now in your browser.</b> GalaXyHaXz and the devilution team has brought the original Diablo to the web using WebAssembly, a groundbreaking technology that enables high-performance applications to run directly in your website. Prepare to slay demons and collect loot, all without leaving your web browser.
              </core-text>
            </demo-frame>
          </section>
          <section>
            <demo-link id="sql"
              title="Web Assembly: SQL ↗️"
              src="https://sqlime.org/"
              author="nalgeon">
              <core-text>
                <b>Experience the power of SQL in-browser.</b> SQLime is a web-based SQL IDE that runs entirely in your browser, powered by WebAssembly-compiled SQLite. Write queries, visualize results, and learn SQL concepts in-place.
              </core-text>
            </demo-link>
          </section>
          <section>
            <demo-frame id="frustrum-culling"
              title="WebGPU: Frustrum Culling"
              src="https://toji.github.io/webgpu-bundle-culling/"
              author="toji"
            >
              <core-text>
                <b>Explore a complex 3D scene containing thousands of objects,</b> optimized with frustum culling: watch the visible objects dynamically change as you navigate.
              </core-text>
            </demo-frame>
        </article>
      </main>
      <script type="module">
        const sidebarMenuContents = [
          { content: "Audio: Synthesizer", href: "#synthesizer" },
          { content: "Audio: Chord Reader", href: "#chord-reader" },
          { content: "Web Assembly: Diablo", href: "#diablo" },
          { content: "Web Assembly: SQL", href: "#sql" },
          { content: "WebGPU: Frustrum Culling", href: "#frustrum-culling" }
        ];

        const sidebarElement = globalThis.document.getElementById("sidebar");
        const sidebarSearchElement = globalThis.document.getElementById("search");
        const sidebarOptionsListElement = globalThis.document.getElementById("sidebar-options");

        const renderSidebarMenuContents = (contents) => {
          sidebarOptionsListElement.replaceChildren(
            // TODO(#195): how do I/can I/should I nest templates?
            ...contents.flatMap(({href, content}) => Array.from($Frontend.Element.html(["<li><a href='", "'>", "</a></li>"], href, content)))
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

        // Swipe detection
        let startX, endX;
        globalThis.addEventListener('touchstart', ({ touches: [{ clientX }] }) => {
          startX = clientX;
        });

        globalThis.addEventListener('touchmove', ({ changedTouches: [{ clientX }]}) => {
          endX = clientX;

          if (endX - startX > 100) {
            sidebar.classList.add("open");
          } else if (startX - endX > 100) {
            sidebar.classList.remove("open");
          }
        });
      </script>
    </body>`;
  },
  handleServiceWorker: () =>
    js`
      self.addEventListener("install", (event) => {
        event.waitUntil(
          caches.open("${route}").then((cache) => {
            return cache.addAll([
              "${route}",
              "/assets/manifest.json"
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
      });`,
});
