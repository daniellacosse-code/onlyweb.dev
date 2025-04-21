import { html, registerElement } from "@onlyweb/frontend";

registerElement<{ author: string; height: number; src: string; title: string; }>("demo-frame", {
  buildAttributes: {
    author: String,
    height: Number,
    src: String,
    title: String,
  },
  handleBuild({ author = "", height = 500, src, title = "Demo Frame" }) {
    const authorElement = author &&
      html`<core-text class="author">Author: ${author}</core-text>`;

    return html`<style>
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
    <core-text type="subtitle">${title as string}</core-text>
    <slot></slot>
    <div class="frame-container">
      <iframe src="${src as string}" title="${title as string}" loading="lazy"></iframe>
      <core-loading-skeleton></core-loading-skeleton>
      ${authorElement as HTMLCollection}
    </div>`;
  },
  handleMount() {
    this.querySelector("iframe")?.addEventListener("load", () => {
      this.querySelector("core-loading-skeleton")?.classList.add("loaded");
    });
  },
});
