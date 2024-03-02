import BackendPage from "/framework/backend-page/module.js";

import * as constants from "/app/constants.js";
import OnlyWebTheme from "/app/pages/shared-theme.js";

BackendPage.Register("/__gallery__", {
  handleRequest: (request) => {
    const logoSrc =
      (request.url.origin.match(/localhost/)
        ? request.url.origin
        : constants.KEYCDN_IMAGE_ZONE_URL) +
      "/app/assets/images/logo/white.png";

    const inliner = BackendPage.Inliner(request);

    return BackendPage.Response.html`<head>
        <meta charset="utf-8" />
        <link rel="icon" href="/app/assets/images/logo/white.png" />
        <link rel="manifest" href="/app/assets/manifest.json" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />

        ${inliner.metadata({
          title: "OnlyWeb Component Gallery",
          description: "A gallery of the onlyweb components"
        })}

        <meta
          name="theme-color"
          content="${constants.THEME_COLOR_BACKGROUND}"
        />
        ${OnlyWebTheme}

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

        ${inliner.elements(
          "/app/elements/core/loading/skeleton.js",
          "/app/elements/core/button.js",
          "/app/elements/core/image.js",
          "/app/elements/core/input.js",
          "/app/elements/core/link.js",
          "/app/elements/core/text.js",
          "/app/elements/gallery/counter-demo.js"
        )}
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
              <core-input label="edit me"></core-input>
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
              src="${logoSrc}"
              width="80"
            ></core-image>
          </section>
        </article>
      </body>`;
  }
});
