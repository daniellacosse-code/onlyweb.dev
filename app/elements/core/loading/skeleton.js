import * as FrontendElement from "/framework/frontend-element/main.js";

FrontendElement.Register({
  tag: "core-loading-skeleton",
  handleRender() {
    return FrontendElement.html`<style>
        .skeleton {
          display: block;
          width: 100%;
          height: 100%;
          border-radius: 0.5rem;
          border: 1px solid hsla(0, 0%, 50%, 0.8);
          background: linear-gradient(
            90deg,
            hsla(0, 0%, 0%, 0) 0%,
            hsla(0, 0%, 80%, 0) 10%,
            hsla(0, 0%, 50%, 0.8) 45%,
            hsla(0, 0%, 50%, 0.8) 55%,
            hsla(0, 0%, 80%, 0) 90%,
            hsla(0, 0%, 0%, 0) 100%
          );
          background-size: 200% 100%;
          animation: skeleton 1s infinite linear;
        }

        @keyframes skeleton {
          0% {
            background-position: 100% 50%;
          }
          100% {
            background-position: -100% 50%;
          }
        }
      </style>
      <div class="skeleton"></div>`;
  }
});
