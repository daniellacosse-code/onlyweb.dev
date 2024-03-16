import Frontend from "/framework/frontend/module.js";

import "/app/elements/core/loading/skeleton.js";

Frontend.Element.Register("core-image", {
  host: {
    handleMount({ src, alt, ...cdnConfig }) {
      const url = new URL(src);

      for (const [key, value] of Object.entries(cdnConfig)) {
        url.searchParams.set(key, value);
      }

      this.__image__ = new Image(cdnConfig.width, cdnConfig.height);
      this.__image__.onload = () => (this.templateAttributes.loaded = true);
      this.__image__.src = url.toString();
      this.__image__.alt = alt;
    }
  },
  template: {
    attributes: {
      src: String,
      alt: String,
      width: Number,
      height: Number,
      loaded: Boolean
    },
    handleBuild({ width, height, loaded }) {
      if (loaded) {
        return Frontend.Element.html`<style>
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

      return Frontend.Element.html`<style>
          :host {
            width: ${width}px;
            height: ${height}px;
            display: inline-block;
          }
        </style>
        <core-loading-skeleton></core-loading-skeleton>`;
    }
  }
});
