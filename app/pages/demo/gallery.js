import * as response from "/framework/backend/response.js";

export default () =>
  response.html`<html>
    <head>
      <title>OnlyWeb Component Gallery</title>
      <link rel="icon" href="/app/assets/images/logo.png" />
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <meta name="robots" content="noindex, nofollow" />

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
          display: flex;
          flex-direction: column;
          align-items: center;
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
            import { DefineStore } from "/framework/frontend/store.js";

            DefineStore({
              events: "counter",
              initialState: { count: 0 },
              handleEvent(event) {
                console.log(event);

                if (event.type === "increment") this.state.count++;
              },
              handleChange({ count }) {
                document.querySelector("core-button").textContent = count;
              }
            });
          </script>

          <core-button store="counter" click="increment">Click me</core-button>
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

      <script type="module" src="/app/elements/core/button.js"></script>
      <script type="module" src="/app/elements/core/loading/skeleton.js"></script>
      <script type="module" src="/app/elements/keycdn/image.js"></script>
    </body>
  </html>`;
