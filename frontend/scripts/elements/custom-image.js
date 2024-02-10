Framework.DefineElement({
  attributes: { src: String, alt: String },
  tag: "custom-image",
  render({ src = "#", alt = "custom image" }) {
    return Framework.html`<img src="${src}" alt="${alt}" />`;
  }
});
