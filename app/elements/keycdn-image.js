import { KEYCDN_IMAGE_ZONE_URL, DENO_PORT } from "../constants.js";
import { html, DefineElement } from "../../framework/frontend/index.js";

DefineElement({
  attributes: {
    src: String,
    alt: String,
    format: String,
    width: Number,
    height: Number
  },
  tag: "keycdn-image",
  render({ src, alt = "keycdn image", format, width, height }) {
    const url = new URL(
      location.host.startsWith("localhost")
        ? `http://localhost:${DENO_PORT}`
        : KEYCDN_IMAGE_ZONE_URL
    );

    url.pathname = src;

    url.searchParams.set("format", format);
    url.searchParams.set("width", width);
    url.searchParams.set("height", height);

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
        }
      </style>
      <img src="${url.toString()}" alt="${alt}" />`;
  }
});
