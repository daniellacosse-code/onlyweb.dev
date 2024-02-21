import * as Page from "/framework/backend/page/html.js";
import * as Component from "/framework/backend/component/register-inline.js";
import * as Constant from "/app/constants.js";

export default (request) => {
  const { searchParams } = new URL(request.url);

  return Page.html`<!DOCTYPE html>
    <html lang="${searchParams.get("lang") ?? "en"}">
      ${Component.registerInline(
        "/app/components/elements/core/loading/skeleton.js",
        "/app/components/elements/keycdn/image.js",
        "/app/components/workers/cache.js",
        "/app/components/workers/reload.js",
        "/app/components/workers/translate.js"
      )}

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
            --color-background: ${Constant.THEME_COLOR_BACKGROUND};
            --color-foreground: ${Constant.THEME_COLOR_FOREGROUND};
            --color-highlight: ${Constant.THEME_COLOR_HIGHLIGHT};

            --size-narrow: ${Constant.THEME_SIZE_NARROW};
            --size-default: ${Constant.THEME_SIZE_DEFAULT};
            --size-large: ${Constant.THEME_SIZE_LARGE};
            --size-huge: ${Constant.THEME_SIZE_HUGE};
            --size-hero: ${Constant.THEME_SIZE_HERO};

            --size-icon: ${Constant.THEME_SIZE_ICON}px;
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
                height="${Constant.THEME_SIZE_ICON}"
                src="/app/assets/images/logo.svg"
                width="${Constant.THEME_SIZE_ICON}"
              ></keycdn-image>
              <keycdn-image
                alt="logo"
                height="${Constant.THEME_SIZE_ICON}"
                src="/app/assets/images/logo.svg"
                width="${Constant.THEME_SIZE_ICON}"
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
      </body>
    </html>`;
};
