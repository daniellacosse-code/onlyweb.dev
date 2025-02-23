import { CoreText } from "../core/text.js";
import { CoreLoadingSkeleton } from "../core/loading/skeleton.js";

export class DemoFrame extends $Frontend.Element {
  tag = "demo-frame";
  attributes = {
    author: String,
    height: Number,
    src: String,
    title: String,
    loaded: Boolean,
  };
  elements = {
    CoreText,
    CoreLoadingSkeleton,
  };
  load() {
    return { attributes: { loaded: true } };
  }
  render({ attributes: { author, height, src, title }, _: { html, msg } }) {
    return html`
      <style>
        :host {
          display: flex;
          flex-direction: column;
          gap: var(--size-narrow);
          height: 100%;
          width: 100%;
        }

        .frame-container {
          position: relative;
        }

        iframe {
          width: 100%;
          height: ${height}px;
          border: 1px solid var(--color-foreground);
        }

        core-loading-skeleton {
          --core-loading-skeleton-border-radius: 0;

          display: inline-block;
          height: ${height}px;
          left: 0;
          position: absolute;
          top: 0;
          width: 100%;
        }

        core-loading-skeleton.loaded {
          animation-duration: var(--animation-duration-fast);
          animation-fill-mode: forwards;
          animation-name: disappear;
          animation-timing-function: var(--animation-timing-function);
        }

        @keyframes disappear {
          0% {
            opacity: 1;
            display: inline-block;
          }
          100% {
            opacity: 0;
            display: none;
          }
        }

        .author {
          font-style: italic;
          opacity: 0.5;
        }
      </style>
      <core-text type="subtitle">${title}</core-text>
      <slot></slot>
      <div class="frame-container">
        <iframe src="${src}" title="${title}" loading="lazy"></iframe>
        <core-loading-skeleton class="${
      loaded ? "loaded" : ""
    }"></core-loading-skeleton>
                ${
      author &&
      html`<core-text class="author">${msg("Author:")} ${author}</core-text>`
    }
      </div>
    `;
  }
}
