import { u as useAppConfig, a as useNuxtApp } from '../server.mjs';
import { ref, onUnmounted, mergeProps, unref, useSSRContext } from 'file:///Users/daniellacosse/code/only-web/node_modules/vue/index.mjs';
import { ssrRenderAttrs, ssrRenderClass, ssrInterpolate } from 'file:///Users/daniellacosse/code/only-web/node_modules/vue/server-renderer/index.mjs';
import 'file:///Users/daniellacosse/code/only-web/node_modules/ofetch/dist/node.mjs';
import 'file:///Users/daniellacosse/code/only-web/node_modules/hookable/dist/index.mjs';
import 'file:///Users/daniellacosse/code/only-web/node_modules/unctx/dist/index.mjs';
import 'file:///Users/daniellacosse/code/only-web/node_modules/@unhead/ssr/dist/index.mjs';
import 'file:///Users/daniellacosse/code/only-web/node_modules/unhead/dist/index.mjs';
import 'file:///Users/daniellacosse/code/only-web/node_modules/@unhead/shared/dist/index.mjs';
import 'file:///Users/daniellacosse/code/only-web/node_modules/vue-router/dist/vue-router.node.mjs';
import 'file:///Users/daniellacosse/code/only-web/node_modules/h3/dist/index.mjs';
import 'file:///Users/daniellacosse/code/only-web/node_modules/ufo/dist/index.mjs';
import 'file:///Users/daniellacosse/code/only-web/node_modules/defu/dist/defu.mjs';
import '../../nitro/nitro-prerenderer.mjs';
import 'file:///Users/daniellacosse/code/only-web/node_modules/node-fetch-native/dist/polyfill.mjs';
import 'file:///Users/daniellacosse/code/only-web/node_modules/destr/dist/index.mjs';
import 'file:///Users/daniellacosse/code/only-web/node_modules/unenv/runtime/fetch/index.mjs';
import 'file:///Users/daniellacosse/code/only-web/node_modules/scule/dist/index.mjs';
import 'file:///Users/daniellacosse/code/only-web/node_modules/ohash/dist/index.mjs';
import 'file:///Users/daniellacosse/code/only-web/node_modules/unstorage/dist/index.mjs';
import 'file:///Users/daniellacosse/code/only-web/node_modules/unstorage/drivers/fs.mjs';
import 'file:///Users/daniellacosse/code/only-web/node_modules/nitropack/node_modules/radix3/dist/index.mjs';

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

export { _sfc_main as default };
//# sourceMappingURL=scanner-0ce0b329.mjs.map
