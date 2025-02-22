$Frontend.Element.Register(
  "core-loading-skeleton",
  () => $Frontend.Element.html`<style>
    div {
      display: block;
      width: 100%;
      height: 100%;
      border-radius: var(--core-loading-skeleton-border-radius);
      background: linear-gradient(
        90deg,
        var(--color-neutral-transparent) 0%,
        var(--color-neutral-semi-transparent) 50%,
        var(--color-neutral-transparent) 100%
      );
      background-size: 800% 100%;
      animation: skeleton 8s infinite linear;
    }

    @keyframes skeleton {
      0% {
        background-position: 400% 50%;
      }
      100% {
        background-position: -400% 50%;
      }
    }
  </style>
  <div></div>`
);
