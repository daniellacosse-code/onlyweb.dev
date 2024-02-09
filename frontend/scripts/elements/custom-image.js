Framework.DefineElement({
  attributes: { src: String },
  tag: "custom-image",
  render({ src = "#" }) {
    return Framework.html`<img src="${src}" alt="custom image" />`;
  }
});
