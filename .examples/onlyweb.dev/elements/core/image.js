import { html, registerElement } from "@onlyweb/frontend";

const attributes = {
  alt: String,
  height: Number,
  loaded: Boolean,
  src: String,
  width: Number,
};

registerElement("core-image", {
  attributes,
  render({ height, loaded, width }) {
    if (loaded) {
      return html`<style>
            img {
              display: inline-block;
              width: ${width}px;
              height: ${height}px;
              object-fit: contain;
              overflow: hidden;
              pointer-events: none;
            }
          </style>
          ${this.__image__}`;
    }

    return html`
        <style>
          core-loading-skeleton {
            display: inline-block;
            width: ${width}px;
            height: ${height}px;
          }
        </style>
        <core-loading-skeleton></core-loading-skeleton>`;
  },
  mount({ alt, src, ...srcParams }) {
    const url = new URL(src);

    for (const [key, value] of Object.entries(srcParams)) {
      url.searchParams.set(key, String(value));
    }

    this.__image__ = new Image(srcParams.width, srcParams.height);
    this.__image__.onload = () => this.setAttribute("loaded", "true");
    this.__image__.src = url.toString();
    this.__image__.alt = alt;
  },
});
