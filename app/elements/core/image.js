import FrontendElement from "/framework/frontend-element/entry.js";

import "/app/elements/core/loading/skeleton.js";

FrontendElement.Register("core-image", {
  attributes: {
    src: String,
    alt: String,
    origin: String,
    width: Number,
    height: Number,
    loaded: Boolean
  },
  handleMount({ src, alt, origin, ...cdnConfig }) {
    this.root = this.attachShadow({ mode: "open" });

    const url = new URL(origin);

    url.pathname = src;
    for (const [key, value] of Object.entries(cdnConfig)) {
      url.searchParams.set(key, value);
    }

    this.__image__ = new Image(cdnConfig.width, cdnConfig.height);
    this.__image__.onload = () => (this.attributes.loaded = true);
    this.__image__.src = url.toString();
    this.__image__.alt = alt;
  },
  handleRender({ width, height, loaded }) {
    if (loaded) {
      return FrontendElement.html`<style>
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
            pointer-events: none;
            user-select: none;
          }
        </style>
        ${this.__image__}`;
    }

    return FrontendElement.html`<style>
        :host {
          width: ${width}px;
          height: ${height}px;
          display: inline-block;
        }
      </style>
      <core-loading-skeleton></core-loading-skeleton>`;
  }
});
