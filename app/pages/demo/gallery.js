import * as Page from "/framework/page/main.js";

export default () => {
  return Page.html`<!DOCTYPE html>
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
          body {
            all: initial;
            font-family: system-ui;
            background: #202123;
          }

          h1 {
            font-size: 2.5rem;
            margin: 0.5rem;
            color: white;
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
        </style>
      </head>
      <body>
        <h1>OnlyWeb Component Gallery</h1>
        <article>
          <section>
            <h2>&lt;core-button&gt;</h2>
            <core-button>Do click me</core-button>
          </section>

          <section>
            <h2>&lt;core-button&gt;[disabled]</h2>
            <core-button disabled>Don't click me</core-button>
          </section>

          <section>
            <h2>&lt;counter-demo&gt;</h2>
            <counter-demo>
              <core-button id="counter-1">0</core-button>
              <core-button id="counter-2">0</core-button>
            </counter-demo>
          </section>

          <section>
            <h2>&lt;core-loading-skeleton&gt;</h2>
            <div style="width: 200px; height: 50px; resize: both; overflow: hidden;">
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

        <reload-service></reload-service>

        ${Page.Inline.elementRegistration(
          "/app/elements/services/reload.js",
          "/app/elements/core/button.js",
          "/app/elements/core/loading/skeleton.js",
          "/app/elements/keycdn/image.js",
          "/app/elements/stores/demo/counter.js"
        )}
      </body>
    </html>`;
};
