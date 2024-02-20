import * as Page from "/framework/backend/page/html.js";
import * as Component from "/framework/backend/component/register-inline.js";

export default (request) => {
  const { origin } = new URL(request.url);

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
              import { RegisterStore } from "/framework/frontend/store/register.js";

              RegisterStore({
                tag: "global-counter",
                listensFor: ["counter.increment"],
                handleEvent(event) {
                  const { id } = event.target.attributes;

                  this.state[id] = (this.state[id] ?? 0) + 1;
                },
                handleChange(state) {
                  for (const [id, count] of Object.entries(state)) {
                    document.querySelector("#" + id).textContent = count;
                  }
                }
              });
            </script>

            <core-button id="counter-1" click="counter.increment"
              >Click me</core-button
            >
            <core-button id="counter-2" click="counter.increment"
              >Click me, too</core-button
            >

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

        ${Component.registerInline(
          "/app/components/elements/core/button.js",
          origin
        )}
        ${Component.registerInline(
          "/app/components/elements/core/loading/skeleton.js",
          origin
        )}
        ${Component.registerInline(
          "/app/components/elements/keycdn/image.js",
          origin
        )}
        ${components.registerInline(
          "/app/components/services/reload.js",
          origin
        )}
      </body>
    </html>`;
};
