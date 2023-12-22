import { ref, mergeProps, useSSRContext } from 'file:///Users/daniellacosse/code/only-web/node_modules/vue/index.mjs';
import { u as useAppConfig } from '../server.mjs';
import { ssrRenderAttrs } from 'file:///Users/daniellacosse/code/only-web/node_modules/vue/server-renderer/index.mjs';
import mapboxgl from 'file:///Users/daniellacosse/code/only-web/node_modules/mapbox-gl/dist/mapbox-gl.js';
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
  __name: "geolocation",
  __ssrInlineRender: true,
  setup(__props) {
    const {
      public: { geolocation }
    } = useAppConfig();
    ref(null);
    mapboxgl.accessToken = geolocation.mapboxToken;
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(mergeProps({ id: "Mapbox" }, _attrs))}></div>`);
    };
  }
};
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/geolocation.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=geolocation-baf87912.mjs.map
