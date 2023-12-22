import { ssrRenderAttrs, ssrRenderAttr } from "vue/server-renderer";
import { useSSRContext } from "vue";
import { _ as _export_sfc } from "./_plugin-vue_export-helper-cc2b3d55.js";
const _imports_0 = "" + __publicAssetsURL("icon.png");
const index_vue_vue_type_style_index_0_scoped_06724522_lang = "";
const _sfc_main = {};
function _sfc_ssrRender(_ctx, _push, _parent, _attrs) {
  _push(`<article${ssrRenderAttrs(_attrs)} data-v-06724522><section data-v-06724522><h1 data-v-06724522><img${ssrRenderAttr("src", _imports_0)} alt="icon" data-v-06724522> only web</h1><p data-v-06724522> A demo showcasing the power of only developing on web. <a href="https://www.howtogeek.com/196087/how-to-add-websites-to-the-home-screen-on-any-smartphone-or-tablet/" target="_blank" rel="noopener" data-v-06724522> [ How to natively install this app on your device. ] </a></p></section><section data-v-06724522><h2 data-v-06724522>Source Code</h2><a href="https://github.com/daniellacosse/only-web" target="_blank" rel="noopener" data-v-06724522><pre data-v-06724522>daniellacosse/only-web</pre></a><br data-v-06724522><a href="https://daniellacos.se" data-v-06724522> about the author </a></section><section data-v-06724522><h2 data-v-06724522>Vue Ecosystem</h2><ul data-v-06724522><li data-v-06724522><a href="https://nuxtjs.org/" target="_blank" rel="noopener" data-v-06724522>nuxt</a></li><li data-v-06724522><a href="https://github.com/vuejs/vue-devtools#vue-devtools" target="_blank" rel="noopener" data-v-06724522> vue-devtools </a></li><li data-v-06724522><a href="https://github.com/vuejs/awesome-vue" target="_blank" rel="noopener" data-v-06724522> awesome-vue </a></li></ul></section><section data-v-06724522><h2 data-v-06724522>Additional Docs</h2><ul data-v-06724522><li data-v-06724522><a href="https://vuejs.org" target="_blank" rel="noopener" data-v-06724522>Vue</a></li><li data-v-06724522><a href="https://www.rust-lang.org/learn" target="_blank" rel="noopener" data-v-06724522> Rust </a></li><li data-v-06724522><a href="https://docs.mapbox.com/" target="_blank" rel="noopener" data-v-06724522> Mapbox </a></li><li data-v-06724522><a href="https://developer.playcanvas.com/en/api/" target="_blank" rel="noopener" data-v-06724522> PlayCanvas </a></li></ul></section></article>`);
}
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/index.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const index = /* @__PURE__ */ _export_sfc(_sfc_main, [["ssrRender", _sfc_ssrRender], ["__scopeId", "data-v-06724522"]]);
export {
  index as default
};
//# sourceMappingURL=index-964e6005.js.map
