import { u as useAppConfig, a as useNuxtApp } from "../server.mjs";
import { ref, onUnmounted, mergeProps, unref, useSSRContext } from "vue";
import "destr";
import { ssrRenderAttrs, ssrRenderClass, ssrInterpolate } from "vue/server-renderer";
import "ofetch";
import "#internal/nitro";
import "hookable";
import "unctx";
import "@unhead/ssr";
import "unhead";
import "@unhead/shared";
import "vue-router";
import "h3";
import "ufo";
import "defu";
const scanner_vue_vue_type_style_index_0_lang = "";
const _sfc_main = {
  __name: "scanner",
  __ssrInlineRender: true,
  setup(__props) {
    const {
      public: {
        scanner: { readoutTextDefault, decoderReaders }
      }
    } = useAppConfig();
    const nuxtApp = useNuxtApp();
    ref(null);
    const data = ref("");
    const isLoading = ref(true);
    onUnmounted(() => {
      var _a;
      return (_a = nuxtApp.$quagga) == null ? void 0 : _a.stop();
    });
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "Quagga" }, _attrs))}><div class="${ssrRenderClass({ Quagga__scanner: true, "Quagga__scanner--loading": unref(isLoading) })}"></div><pre>${ssrInterpolate(unref(isLoading) ? "Loading..." : unref(data) || unref(readoutTextDefault))}</pre></div>`);
    };
  }
};
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/scanner.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
export {
  _sfc_main as default
};
//# sourceMappingURL=scanner-0ce0b329.js.map
