import { response as html } from "/framework/backend/html/index.js";

export default (request) => {
  const { origin } = new URL(request.url);

  return html`<!DOCTYPE html>
    <html lang="en">
      <head>
        <meta charset="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />

        <title>2</title>
        <meta
          name="description"
          content="only web. only web. only web. only web. only web. only web. only web. only web. only web. only web. only web. only web."
        />
        <link rel="icon" href="/app/assets/images/logo.png" />
        <link rel="manifest" href="/app/assets/manifest.json" />
        <meta name="theme-color" content="#202123" />

        <meta name="og:image" content="/app/assets/images/logo.png" />
        <meta name="og:title" content="2" />
        <meta name="og:url" content="https://only-web.com/" />
        <meta name="og:type" content="website" />
        <meta
          name="og:description"
          content="only web. only web. only web. only web. only web. only web. only web. only web. only web. only web. only web. only web."
        />

        <style>
          body {
            all: initial;
            font-family: system-ui;
          }

          header {
            width: 100vw;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            min-height: 20svh;
            padding: 1rem;
            box-sizing: border-box;
            background: #202123;
            color: #f3f5f6;
          }

          h1 {
            font-size: 2.5rem;
            margin: 0.5rem;
          }

          h2.hero {
            font-size: 3.5rem;
            margin: 1rem;
          }

          p.hero {
            font-size: 1.5rem;
          }

          article {
            height: 80svh;
            background: #f3f5f6;
            color: #202123;
            box-sizing: border-box;
            padding: 8svh 0;
            text-align: center;
          }

          a {
            color: #6c6066;
            text-decoration: none;
          }

          a:hover {
            color: #f3f5f6;
            background: #202123;
          }

          .logo {
            display: block;
            min-height: 80px;
          }

          a::after {
            content: " ↗";
          }

          iframe {
            border: none;
          }
        </style>
      </head>
      <body>
        <main>
          <header>
            <div class="logo">
              <keycdn-image
                alt="logo"
                format="webp"
                height="80"
                src="/app/assets/images/logo.png"
                width="80"
              ></keycdn-image>
              <keycdn-image
                alt="logo"
                format="webp"
                height="80"
                src="/app/assets/images/logo.png"
                width="80"
              ></keycdn-image>
            </div>
            <h1>only web 2</h1>
          </header>
          <article>
            <section>
              <h2 class="hero">Please pardon our dust.</h2>
            </section>
            <section>
              <p class="hero">
                We're currently rebuilding literally everything.
                <a href="https://DanielLaCos.se">Follow along</a>
              </p>
            </section>
          </article>
        </main>

        ${html.inline("./app/elements/core/loading/skeleton.js", origin)}
        ${html.inline("./app/elements/keycdn/image.js", origin)}
        ${html.inline("./framework/frontend/reload.js", origin)}
      </body>
    </html>`;
};
