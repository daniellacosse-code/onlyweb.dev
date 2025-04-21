import { type ConvertConstructorShapeToPrimitiveShape as $, html, registerElement } from "@onlyweb/frontend";

const buildAttributes = {
  alt: String,
  height: Number,
  loaded: Boolean,
  src: String,
  width: Number,
};

type ImageElementState = {
  __image__?: HTMLImageElement
}

registerElement<$<typeof buildAttributes>, ImageElementState>("core-image", {
  buildAttributes,
  handleBuild({ height, loaded, width }) {
    if (loaded) {
      return html`<style>
            img {
              display: inline-block;
              width: ${width};
              height: ${height};
              object-fit: contain;
              overflow: hidden;
              pointer-events: none;
            }
          </style>
          ${this.__image__ as HTMLElement}`;
    }

    return html`
        <style>
          core-loading-skeleton {
            display: inline-block;
            width: ${width};
            height: ${height};
          }
        </style>
        <core-loading-skeleton></core-loading-skeleton>`;
  },
  handleMount({ alt, src, ...srcParams }) {
    const url = new URL(src as string);

    for (const [key, value] of Object.entries(srcParams)) {
      url.searchParams.set(key, String(value));
    }

    this.__image__ = new Image(srcParams.width, srcParams.height);
    this.__image__.onload = () => (this.buildAttributes.loaded = true);
    this.__image__.src = url.toString();
    this.__image__.alt = alt as string;
  },
});
