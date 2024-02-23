import * as Backend from "/framework/backend/main.js";

export default (request) => {
  const { origin } = new URL(request.url);

  return Backend.Page.html`<!DOCTYPE html>
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
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
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
            <script type="module">
              import { RegisterStore } from "/framework/frontend/store.js";

              RegisterStore({
                tag: "counter-store",
                state: { ["counter-1"]: 0, ["counter-2"]: 0 },
                listensFor: ["click"],
                handleEvent(event) {
                  if (event.type === "click")
                    this.state[event.target.attributes.id]?.++;
                },
                handleRender(state) {
                  for (const [id, count] of Object.entries(state))
                    this.host.getElementById(id).textContent = count;
                }
              });
            </script>

            <counter-store id="counter-demo">
              <core-button id="counter-1">Click me</core-button>
              <core-button id="counter-2">Click me, too</core-button>
            </counter-store>

            <core-button disabled>Don't click me</core-button>
          </section>

          <section>
            <h2>&lt;core-loading-skeleton&gt;</h2>
            <div style="width: 200px; height: 50px;">
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

        <script
          type="module"
          src="/app/elements/core/button.js"
        ></script>
        <script
          type="module"
          src="/app/elements/core/loading/skeleton.js"
        ></script>
        <script
          type="module"
          src="/app/elements/keycdn/image.js"
        ></script>

        ${Backend.Element.registerInline(
          "/app/elements/services/reload.js",
          origin
        )}
      </body>
    </html>`;
};
