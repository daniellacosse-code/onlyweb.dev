import { html, registerElement, HTMLElementWithBuildAttributes } from "@onlyweb/frontend";

interface ImageElement extends HTMLElementWithBuildAttributes {
  __image__?: HTMLImageElement;
}

registerElement("core-image", {
  buildAttributes: {
    alt: String,
    height: String,
    loaded: Boolean,
    src: String,
    width: String,
  },
  handleBuild(this: ImageElement, { height, loaded, width }) {
    if (loaded) {
      return html`<style>
            img {
              display: inline-block;
              width: ${width as string};
              height: ${height as string};
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
            width: ${width as string};
            height: ${height as string};
          }
        </style>
        <core-loading-skeleton></core-loading-skeleton>`;
  },
  handleMount(this: ImageElement, { alt, src, ...srcParams }) {
    const url = new URL(src as string);

    for (const [key, value] of Object.entries(srcParams)) {
      url.searchParams.set(key, value as string);
    }

    this.__image__ = new Image(Number(srcParams.width), Number(srcParams.height));
    this.__image__.onload = () => (this.buildAttributes.loaded = true);
    this.__image__.src = url.toString();
    this.__image__.alt = alt as string;
  },
});
