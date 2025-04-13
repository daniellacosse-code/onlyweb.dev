$Frontend.Element.Register("core-image", {
  buildAttributes: {
    alt: String,
    height: String,
    loaded: Boolean,
    src: String,
    width: String
  },
  handleBuild({ height, loaded, width }) {
    if (loaded) {
      return $Frontend.Element.html`<style>
            img {
              display: inline-block;
              width: ${width};
              height: ${height};
              object-fit: contain;
              overflow: hidden;
              pointer-events: none;
            }
          </style>
          ${this.__image__}`;
    }

    return $Frontend.Element.html`
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
    const url = new URL(src);

    for (const [key, value] of Object.entries(srcParams)) {
      url.searchParams.set(key, value);
    }

    this.__image__ = new Image(srcParams.width, srcParams.height);
    this.__image__.onload = () => (this.buildAttributes.loaded = true);
    this.__image__.src = url.toString();
    this.__image__.alt = alt;
  }
});
