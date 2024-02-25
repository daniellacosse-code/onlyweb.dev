import * as BackendPage from "/framework/backend-page/main.js";

import * as constants from "/app/constants.js";

export default (request) => {
  const { origin, searchParams } = new URL(request.url);
  const code = searchParams.get("lang") ?? "en";

  return BackendPage.html`<!DOCTYPE html>
    <html lang="${code}">
      <head>
        <meta charset="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />

        <title>2</title>
        <meta
          name="description"
          content="only web. only web. only web. only web. only web. only web. only web. only web. only web. only web. only web. only web."
        />
        <link rel="icon" href="/app/assets/images/logo/white.svg" />
        <link rel="manifest" href="/app/assets/manifest.json" />
        <meta name="theme-color" content="#202123" />

        <meta name="og:image" content="/app/assets/images/logo/white.svg" />
        <meta name="og:title" content="2" />
        <meta name="og:url" content="https://only-web.com/" />
        <meta name="og:type" content="website" />
        <meta
          name="og:description"
          content="only web. only web. only web. only web. only web. only web. only web. only web. only web. only web. only web. only web."
        />

        <style>
          :root {
            --color-background: ${constants.THEME_COLOR_BACKGROUND};
            --color-foreground: ${constants.THEME_COLOR_FOREGROUND};
            --color-highlight: ${constants.THEME_COLOR_HIGHLIGHT};

            --color-neutral: ${constants.THEME_COLOR_NEUTRAL};
            --color-neutral-semi-transparent: ${
              constants.THEME_COLOR_NEUTRAL_SEMITRANSPARENT
            };
            --color-neutral-transparent: ${
              constants.THEME_COLOR_NEUTRAL_TRANSPARENT
            };

            --size-hairline: 2px;
            --size-narrow: ${constants.THEME_SIZE_NARROW};
            --size-default: ${constants.THEME_SIZE_DEFAULT};
            --size-large: ${constants.THEME_SIZE_LARGE};
            --size-huge: ${constants.THEME_SIZE_HUGE};
            --size-hero: ${constants.THEME_SIZE_HERO};

            --size-text-title: 3rem;
            --size-text-subtitle: 2rem;
            --size-text-paragraph: 1rem;

            --size-icon: ${constants.THEME_SIZE_ICON}px;

            --animation-duration: 350ms;
            --animation-timing-function: cubic-bezier(0.6, 0.15, 0, 1);
          }

          ::selection {
            background: var(--color-highlight);
            color: var(--color-background);
          }

          body {
            all: initial;
            font-family: system-ui;
            touch-events: pan-y;
            background: var(--color-background);
          }

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
          <translation-helper code="${code}">
            <header>
              <div class="logo">
                <keycdn-image
                  alt="logo"
                  height="${constants.THEME_SIZE_ICON}"
                  src="/app/assets/images/logo/black.svg"
                  width="${constants.THEME_SIZE_ICON}"
                ></keycdn-image>
                <keycdn-image
                  alt="logo"
                  height="${constants.THEME_SIZE_ICON}"
                  src="/app/assets/images/logo/black.svg"
                  width="${constants.THEME_SIZE_ICON}"
                ></keycdn-image>
              </div>
              <core-text id="title" kind="title">only web 2</core-text>
            </header>
            <article>
              <section>
                <core-text id="apology" kind="subtitle">Please pardon our dust.</core-text>
              </section>
              <section>
                <core-text id="explaination">We're currently rebuilding literally everything.</core-text>
                <core-link id="call-to-action" href="https://DanielLaCos.se">Follow along</core-link>
              </section>
            </article>
          </translation-helper>
        </main>

        <reload-helper></reload-helper>

        ${BackendPage.Inline.elements(
          origin,
          "/app/elements/core/loading/skeleton.js",
          "/app/elements/keycdn/image.js",
          "/app/elements/core/link.js",
          "/app/elements/core/text.js",
          "/app/elements/helpers/reload.js",
          "/app/elements/helpers/translate.js"
        )}
      </body>
    </html>`;
};
