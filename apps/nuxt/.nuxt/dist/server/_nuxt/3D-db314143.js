import { ref, onUnmounted, mergeProps, useSSRContext } from "vue";
import "hookable";
import "destr";
import { u as useAppConfig } from "../server.mjs";
import { ssrRenderAttrs } from "vue/server-renderer";
import { _ as _export_sfc } from "./_plugin-vue_export-helper-cc2b3d55.js";
import "ofetch";
import "#internal/nitro";
import "unctx";
import "@unhead/ssr";
import "unhead";
import "@unhead/shared";
import "vue-router";
import "h3";
import "ufo";
import "defu";
const _3D_vue_vue_type_style_index_0_scoped_a64257d9_lang = "";
const _sfc_main = {
  __name: "3D",
  __ssrInlineRender: true,
  setup(__props) {
    useAppConfig();
    ref(null);
    const game = ref(null);
    onUnmounted(() => game.value.pause());
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "ThreeDimensionalCanvas__container" }, _attrs))} data-v-a64257d9><canvas class="ThreeDimensionalCanvas" data-v-a64257d9></canvas></div>`);
    };
  }
};
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/3D.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const _3D = /* @__PURE__ */ _export_sfc(_sfc_main, [["__scopeId", "data-v-a64257d9"]]);
export {
  _3D as default
};
//# sourceMappingURL=3D-db314143.js.map
