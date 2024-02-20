import { KEYCDN_IMAGE_ZONE_URL, DENO_PORT } from "/app/constants.js";
import { html, DefineElement } from "/framework/frontend/index.js";

import "/app/elements/core/loading/skeleton.js";

DefineElement({
  attributes: {
    src: String,
    alt: String,
    format: String,
    width: Number,
    height: Number,
    loaded: Boolean
  },
  tag: "keycdn-image",
  handleMount({ src, alt, ...keycdnAttributes }) {
    // TODO(#127): pull image host from the environment
    const url = new URL(
      location.host.startsWith("localhost")
        ? `http://localhost:${DENO_PORT}`
        : KEYCDN_IMAGE_ZONE_URL
    );

    url.pathname = src;
    for (const [key, value] of Object.entries(keycdnAttributes)) {
      url.searchParams.set(key, value);
    }

    this.image = new Image(keycdnAttributes.width, keycdnAttributes.height);
    this.image.onload = () => (this.attributes.loaded = true);
    this.image.src = url.toString();
    this.image.alt = alt;
  },
  handleRender({ width, height, loaded }) {
    if (loaded) {
      // TODO(#126): have `keycdn-image` fade in on image load
      return html`<style>
          :host {
            width: ${width}px;
            height: ${height}px;
            display: inline-block;
          }
          img {
            width: 100%;
            height: 100%;
            object-fit: contain;
            overflow: hidden;
          }
        </style>
        ${this.image}`;
    }

    return html`<style>
        .container {
          width: ${width}px;
          height: ${height}px;
          display: inline-block;
        }
      </style>
      <div class="container">
        <core-loading-skeleton></core-loading-skeleton>
      </div>`;
  }
});
