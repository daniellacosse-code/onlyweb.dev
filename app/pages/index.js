import * as Backend from "/framework/backend/main.js";

import { translate } from "/app/elements/services/translate.js";
import * as constants from "/app/constants.js";

export default async (request) => {
  const { origin } = new URL(request.url);
  const translation = await translate(request);

  return Backend.Page.html`<!DOCTYPE html>
    <html lang="${translation.code}">
      <head>
        <meta charset="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />

        <title>2</title>
        <meta
          name="description"
          content="only web. only web. only web. only web. only web. only web. only web. only web. only web. only web. only web. only web."
        />
        <link rel="icon" href="/app/assets/images/logo.svg" />
        <link rel="manifest" href="/app/assets/manifest.json" />
        <meta name="theme-color" content="#202123" />

        <meta name="og:image" content="/app/assets/images/logo.svg" />
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

            --size-narrow: ${constants.THEME_SIZE_NARROW};
            --size-default: ${constants.THEME_SIZE_DEFAULT};
            --size-large: ${constants.THEME_SIZE_LARGE};
            --size-huge: ${constants.THEME_SIZE_HUGE};
            --size-hero: ${constants.THEME_SIZE_HERO};

            --size-icon: ${constants.THEME_SIZE_ICON}px;
          }

          ::selection {
            background: var(--color-highlight);
            color: var(--color-background);
          }

          body {
            all: initial;
            font-family: system-ui;
            touch-events: pan-y;
            background: var(--color-foreground);
          }

          main {
            align-items: center;
            display: flex;
            flex-direction: column;
            justify-content: center;
            min-height: 100svh;
            width: 100vw;
          }

          header {
            align-items: center;
            background: var(--color-background);
            box-sizing: border-box;
            color: var(--color-foreground);
            display: flex;
            flex-direction: column;
            flex-shrink: 0;
            justify-content: center;
            padding: var(--size-huge) 0;
            width: 100vw;
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

          a,
          a::selection {
            color: white;
            background: var(--color-background);
            text-decoration: none;
          }

          a:hover {
            color: var(--color-background);
            background: var(--color-highlight);
          }

          a::after {
            content: " ↗";
          }

          h2.hero {
            font-size: var(--size-hero);
            margin: var(--size-narrow) 0;
          }

          p.hero {
            font-size: var(--size-large);
            margin: 0;
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
              <keycdn-image
                alt="logo"
                height="${constants.THEME_SIZE_ICON}"
                src="/app/assets/images/logo.svg"
                width="${constants.THEME_SIZE_ICON}"
              ></keycdn-image>
              <keycdn-image
                alt="logo"
                height="${constants.THEME_SIZE_ICON}"
                src="/app/assets/images/logo.svg"
                width="${constants.THEME_SIZE_ICON}"
              ></keycdn-image>
            </div>
            <h1 id="title">only web 2</h1>
          </header>
          <article>
            <section>
              <h2 id="apology" class="hero">Please pardon our dust.</h2>
            </section>
            <section>
              <p class="hero">
                <span id="explaination">We're currently rebuilding literally everything.</span>
                <a id="call-to-action" href="https://DanielLaCos.se">Follow along</a>
              </p>
            </section>
          </article>
        </main>

        ${translation.service}

        ${Backend.Element.registerInline(
          "/app/elements/core/loading/skeleton.js",
          origin
        )}
        ${Backend.Element.registerInline(
          "/app/elements/keycdn/image.js",
          origin
        )}
        ${Backend.Element.registerInline(
          "/app/elements/services/reload.js",
          origin
        )}
      </body>
    </html>`;
};
