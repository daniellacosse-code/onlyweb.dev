import * as BackendPage from "/framework/backend-page/main.js";

import * as constants from "/app/constants.js";

export default (request) => {
  const { origin } = new URL(request.url);

  return BackendPage.html`<!DOCTYPE html>
    <html lang="en">
      <head>
        <title>OnlyWeb Component Gallery</title>
        <link rel="icon" href="/app/assets/images/logo.png" />
        <link rel="manifest" href="/app/assets/manifest.json" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="theme-color" content="#202123" />
        <meta
          name="description"
          content="A gallery of the onlyweb components"
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

          body {
            all: initial;
            font-family: system-ui;
            background: var(--color-background);
          }

          h1 {
            font-size: 2.5rem;
            padding: 2rem;
            color: var(--color-background);
            background: var(--color-foreground);
            margin: 0;
            text-align: center;
          }

          article {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(30vw, 1fr));
            gap: 2rem;
          }

          section {
            margin: 2rem;
            display: flex;
            flex-direction: column;
            align-items: center;
            gap: 1rem;
          }

          h2 {
            font-size: 1rem;
            margin: 0.5rem;
            font-family: Menlo, monospace;
            background: lightgray;
            color: darkred;
            padding: 0.5rem;
            border-radius: 0.5rem;
          }

          .resize-container {
            width: 200px;
            height: 80px;
            resize: both;
            overflow: hidden;
            padding: 1rem;
          }
        </style>
      </head>
      <body>
        <h1>OnlyWeb Component Gallery</h1>
        <article>
        <section>
            <h2>&lt;core-text&gt;</h2>
            <core-text kind="title">Hello, World!</core-text>
            <core-text kind="subtitle">Hello, World!</core-text>
            <core-text kind="paragraph">Hello, World!</core-text>
          </section>

          <section>
            <h2>&lt;core-link&gt;</h2>
            <core-link href="https://DanielLaCos.se">
              <core-text>DanielLaCos.se</core-text>
            </core-link>
          </section>

          <section>
            <h2>&lt;core-button&gt;</h2>
            <div class="resize-container">
              <core-button>
                <core-text>Do click me</core-text>
              </core-button>
            </div>
          </section>

          <section>
            <h2>&lt;core-button disabled&gt;</h2>
            <div class="resize-container">
              <core-button disabled>Don't click me</core-button>
            </div>
          </section>

          <section>
            <h2>&lt;counter-demo&gt;</h2>
              <counter-demo>
                <core-button id="counter-1">0</core-button>
                <core-button id="counter-2">0</core-button>
              </counter-demo>
          </section>

          <section>
            <h2>[WIP] &lt;core-input&gt;</h2>
            <div class="resize-container">
              <core-input label="test">
                edit me
              </core-input>
            </div>
          </section>

          <section>
            <h2>&lt;core-loading-skeleton&gt;</h2>
            <div class="resize-container">
              <core-loading-skeleton></core-loading-skeleton>
            </div>
          </section>

          <section>
            <h2>&lt;keycdn-image&gt;</h2>
            <keycdn-image
              alt="logo"
              format="webp"
              height="80"
              src="/app/assets/images/logo.png"
              width="80"
            ></keycdn-image>
          </section>
        </article>

        <reload-helper></reload-helper>

        ${BackendPage.Inline.elements(
          origin,
          "/app/elements/core/button.js",
          "/app/elements/core/text.js",
          "/app/elements/core/link.js",
          "/app/elements/core/input.js",
          "/app/elements/core/loading/skeleton.js",
          "/app/elements/keycdn/image.js",
          "/app/elements/demo/counter.js",
          "/app/elements/helpers/reload.js"
        )}
      </body>
    </html>`;
};
