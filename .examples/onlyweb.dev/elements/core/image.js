import { CoreLoadingSkeleton } from "./loading/skeleton.js";

export class CoreImage extends $Frontend.Element {
  attributes = {
    alt: String,
    height: String,
    loaded: Boolean,
    src: String,
    width: String,
  };

  elements = {
    CoreLoadingSkeleton,
  };

  get #image() {
    const url = new URL(this.attributes.src);

    for (const [key, value] of Object.entries(this.attributes)) {
      url.searchParams.set(key, value);
    }

    const image = new Image(this.attributes.width, this.attributes.height);

    image.src = url.toString();

    return image;
  }

  load() {
    return { attributes: { loaded: true } };
  }

  render({ attributes: { loaded, width, height }, _: { html } }) {
    if (!loaded) {
      return html`
        <style>
          core-loading-skeleton {
            display: inline-block;
            width: ${width};
            height: ${height};
          }
        </style>
        <core-loading-skeleton></core-loading-skeleton>
      `;
    }

    return html`
      <style>
        img {
          display: inline-block;
          width: ${width};
          height: ${height};
          object-fit: contain;
          overflow: hidden;
          pointer-events: none;
        }
      </style>
      ${this.#image}
    `;
  }
}
