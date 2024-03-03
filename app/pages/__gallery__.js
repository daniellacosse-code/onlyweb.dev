import BackendPage from "/framework/backend-page/entry.js";

import * as constants from "/app/constants.js";
import sharedTheme from "/app/pages/shared-theme.js";

BackendPage.Register("/__gallery__", {
  handleRequest: (request) => {
    return BackendPage.html` <head>
        <meta charset="utf-8" />
        <link rel="icon" href="/app/assets/images/logo/white.png" />
        <link rel="manifest" href="/app/assets/manifest.json" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta
          name="theme-color"
          content="${constants.THEME_COLOR_BACKGROUND}"
        />

        ${BackendPage.Inline.metadata({
          title: "OnlyWeb Component Gallery",
          description: "A gallery of the onlyweb components"
        })}
        ${sharedTheme()}

        <style>
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
            min-height: 80px;
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
              <div style="display: flex; gap: 1rem;">
                <core-button id="counter-1">0</core-button>
                <core-button id="counter-2">0</core-button>
              </div>
            </counter-demo>
          </section>

          <section>
            <h2>[WIP] &lt;core-input&gt;</h2>
            <div class="resize-container">
              <core-input label="edit me"></core-input>
            </div>
          </section>

          <section>
            <h2>[WIP] &lt;core-input type="password"&gt;</h2>
            <div class="resize-container">
              <core-input label="give secrets" type="password"></core-input>
            </div>
          </section>

          <section>
            <h2>&lt;core-loading-skeleton&gt;</h2>
            <div class="resize-container">
              <core-loading-skeleton></core-loading-skeleton>
            </div>
          </section>

          <section>
            <h2>&lt;core-image&gt;</h2>
            <core-image
              alt="logo"
              format="webp"
              height="80"
              src="/app/assets/images/logo/white.png"
              width="80"
              origin="${
                request.url.origin === "http://localhost:8000"
                  ? request.url.origin
                  : constants.KEYCDN_IMAGE_ZONE_URL
              }"
            ></core-image>
          </section>
        </article>

        <reload-helper></reload-helper>

        ${BackendPage.Inline.elements(
          request.url.origin,
          "/app/elements/core/button.js",
          "/app/elements/core/text.js",
          "/app/elements/core/link.js",
          "/app/elements/core/input.js",
          "/app/elements/core/loading/skeleton.js",
          "/app/elements/core/image.js",
          "/app/elements/gallery/counter-demo.js",
          "/app/elements/helpers/reload.js"
        )}
      </body>`;
  }
});
