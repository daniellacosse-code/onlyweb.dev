$Frontend.Element.Register("demo-link", {
  buildAttributes: {
    src: String,
    title: String
  },
  handleBuild({ src, title }) {
    return $Frontend.Element.html`
      <style>
        core-link {
          --core-link-color: var(--color-neutral);
        }

        core-link:hover core-text {
          --core-text-color-subtitle: var(--color-primary);

          cursor: ne-resize;
        }
      </style>
      <core-link href="${src}">
        <core-text type="subtitle">${title}</core-text>
      </core-link>
      <br />
      <slot></slot>`;
  }
});
