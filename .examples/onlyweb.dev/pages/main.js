import "jsr:@lonly/web";

import en from "../messages/en-US.json" with { type: "json" };
import sp from "../messages/sp.json" with { type: "json" };
import fr from "../messages/fr.json" with { type: "json" };
import ja from "../messages/ja.json" with { type: "json" };

import * as constants from "../constants.js";
import OnlyWebTheme from "./shared-theme.js";

import { CoreImage } from "../elements/core/image.js";
import { CoreText } from "../elements/core/text.js";
import { CoreInput } from "../elements/core/input.js";
import { DemoFrame } from "../elements/demo/frame.js";
import { DemoLink } from "../elements/demo/link.js";

const SIDEBAR_MENU_OPTIONS = [
  { content: "Audio: Synthesizer", href: "#synthesizer" },
  { content: "Audio: Chord Reader", href: "#chord-reader" },
  { content: "Web Assembly: Diablo", href: "#diablo" },
  { content: "Web Assembly: SQL", href: "#sql" },
  { content: "WebGPU: Frustrum Culling", href: "#frustrum-culling" },
];

export class MainPage extends $Backend.Page {
  path = "/";
  messages = { en, sp, fr, ja };
  environment = { dev: Deno.env.DEV };
  elements = {
    CoreImage,
    CoreText,
    CoreInput,
    DemoFrame,
    DemoLink,
  };
  attributes = {
    menuOptions: Array,
    searchValue: String,
    sidebarOpen: Boolean,
    swipeStart: Number,
    swipeDistance: Number,
  };

  touchstart({ event: { touches: [{ clientX }] } }) {
    return { attributes: { swipeStart: clientX } };
  }

  touchmove(
    {
      attributes: { swipeStart, swipeDistance = 100 },
      event: { changedTouches: [{ clientX }] },
    },
  ) {
    if (clientX - swipeStart > swipeDistance) {
      return { attributes: { sidebar: true } };
    }

    return { attributes: { sidebar: false } };
  }

  input({ event: { target: { value } } }) {
    return { attributes: { searchValue: value.toLowerCase() } };
  }

  async install({ event }) {
    const cache = await globalThis.caches.open(this.path);

    cache.addAll([this.path, "/manifest.json"]);

    event.waitUntil(cache);
  }

  async fetch({ event }) {
    const cache = await globalThis.caches.open(this.path);

    let response = await event.request;

    if (!response) {
      response = await fetch(event.request);

      cache.put(event.request, response.clone());

      return event.respondWith(response);
    }

    event.respondWith(response);
  }

  render(
    {
      attributes: {
        menuOptions = SIDEBAR_MENU_OPTIONS,
        sidebarOpen,
        searchValue = "",
      },
      environment: { dev },
      _: { html, meta, msg },
    },
  ) {
    const logoSrc = dev ? "http://localhost" : constants.KEYCDN_IMAGE_ZONE_URL +
      "/images/logo/black.svg";

    const inverseLogoSrc = dev
      ? "http://localhost"
      : constants.KEYCDN_IMAGE_ZONE_URL +
        "/images/logo/white.svg";

    return html`
      <head>
        <meta charset="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="manifest" href="/manifest.json" />

        ${
      meta({
        title: "2",
        description: msg(
          "only web. only web. only web. only web. only web. only web. only web. only web. only web. only web. only web. only web",
        ),
        previewImage: "/images/root-preview.png",
        iconImage: "/images/logo/maskable.png",
        splashImage: "/images/logo/splash.png",
        url: "https://onlyweb.dev/",
      })
    }

<meta name="theme-color" content="${constants.THEME_COLOR_BACKGROUND}" />
      ${OnlyWebTheme}

  </head>
  <style>
        main {
          display: flex;
          flex-direction: row;
          min-height: 100svh;
          width: 100vw;
        }

        nav {
          background: var(--color-foreground);
          position: sticky;
          top: 0;
          display: flex;
          flex-direction: column;
          flex-shrink: 0;
          height: 100vh;
          max-width: min-content;
          text-align: center;
          transform: translateX(0%);
          transition: transform var(--animation-duration) var(--animation-timing-function);
          will-change: transform;
          z-index: 1;
        }

        nav header {
          margin: var(--size-default);
        }

        nav header core-text {
          --core-text-color-title: var(--color-background);
          --core-text-size-title: 1.5rem;
          flex-shrink: 0;
          white-space: nowrap;
        }

        nav core-input {
          --color-foreground: var(--color-background);
          text-align: left;
        }

        .input-wrapper {
          padding: 0 var(--size-narrow);
        }

        nav ul {
          all: initial;
          flex-grow: 1;
          margin-top: var(--size-default);
        }

        nav ul li {
          list-style-type: none;
        }

        nav ul li a {
          all: initial;
          cursor: pointer;
          display: block;
          font-family: system-ui;
          padding: var(--size-narrow);
          padding-left: var(--size-large);
          text-align: right;
          transition: background-color var(--animation-duration-fast) var(--animation-timing-function);
          user-select: none;
        }

        nav ul li a:hover {
          background-color: var(--color-highlight);
          color: var(--color-background);
        }

        article {
          box-sizing: border-box;
          flex-grow: 1;
          padding: var(--size-large);
          will-change: width;
        }

        section {
          display: flex;
          flex-direction: column;
          gap: var(--size-narrow);
          margin: var(--size-huge) 0;
        }

        article section header {
          display: flex;
          align-items: center;
          gap: 3px;
        }

        article section header core-text {
          white-space: nowrap;
        }

        hr { 
          width: 100%;
        }

        @media screen and (max-width: 768px) {
          nav {
            transform: translateX(calc(var(--size-narrow) - 100%));
            position: fixed;
            top: 0;
          }

          nav.open, nav:hover {
            transform: translateX(0%);
          }
        }
      </style>
    </head>
    <body>
      <main>
      <nav id="sidebar" class="${sidebarOpen ? "open" : ""}">
        <header>
          <core-image src="${logoSrc}" alt="logo" width="64px" height="64px"></core-image>
          <core-text type="title" style="font-weight: bold; font-size: 1.5rem;">${
      msg("only web 2")
    }</core-text>
        </header>
        <div class="input-wrapper">
          <core-input id="search" type="search" label="Search..."></core-input>
        </div>
        <ul id="sidebar-options">
          ${
      menuOptions
        .filter(({ content }) => content.toLowerCase().match(searchValue))
        .map(({ content, href }) =>
          html`
                <li>
                  <a href="${href}">${content}</a>
                </li>
              `
        )
    }
        </ul>
      </nav>
        <article>
          <section>
            <header>
              <core-image src="${inverseLogoSrc}" alt="logo" width="96px" height="96px"></core-image>
              <core-text type="title">nly web</core-text>
            </header>
            <core-text type="paragraph">
              <i>[alpha]</i><br/><br/>
              <b>Discover the potential of only web.</b>
              Explore cutting-edge capabilities, challenging the need for a native app for every experience.
              <i>Get ready to rethink what's possible online.</i>
            </core-text>
          </section>
          <section>
            <hr />
          </section>
          <section>
            <demo-link id="synthesizer"
              title="Audio: Synthesizer ↗️"
              author="Ableton"
              src="https://learningsynths.ableton.com/en/playground"
            >
              <core-text>
                <b>Unleash your inner musician with Ableton's web-based synthesizer.</b> Dive deep into sound creation with multiple oscillators, filters, and envelopes at your fingertips. Compose melodies using your keyboard, and then download your masterpiece to share with the world.
              </core-text>
            </demo-link>
          </section>
          <section>
            <demo-frame id="chord-reader"
              title="Audio: Chord Reader Prototype"
              src="/demos/music"
              height=600
            >
              <core-text>
                <b>Uncover the magic behind your favorite tunes with our interactive chord progression tool.</b> Simply input your desired chord sequence and hear how it sounds. It's the perfect way to experiment with different chord combinations, understand music structure, and even start creating your own compositions.
              </core-text>
            </demo-frame>
          </section>
          <section>
            <demo-frame id="diablo"
              title="Web Assembly: Diablo"
              src="https://d07riv.github.io/diabloweb/"
              height=650
              author="d07riv"
            >
              <core-text>
                <b>Relive the classic dungeon-crawling experience, now in your browser.</b> GalaXyHaXz and the devilution team has brought the original Diablo to the web using WebAssembly, a groundbreaking technology that enables high-performance applications to run directly in your website. Prepare to slay demons and collect loot, all without leaving your web browser.
              </core-text>
            </demo-frame>
          </section>
          <section>
            <demo-link id="sql"
              title="Web Assembly: SQL ↗️"
              src="https://sqlime.org/"
              author="nalgeon">
              <core-text>
                <b>Experience the power of SQL in-browser.</b> SQLime is a web-based SQL IDE that runs entirely in your browser, powered by WebAssembly-compiled SQLite. Write queries, visualize results, and learn SQL concepts in-place.
              </core-text>
            </demo-link>
          </section>
          <section>
            <demo-frame id="frustrum-culling"
              title="WebGPU: Frustrum Culling"
              src="https://toji.github.io/webgpu-bundle-culling/"
              author="toji"
            >
              <core-text>
                <b>Explore a complex 3D scene containing thousands of objects,</b> optimized with frustum culling: watch the visible objects dynamically change as you navigate.
              </core-text>
            </demo-frame>
          </section>
        </article>
      </main>
    </body>
  `;
  }
}
