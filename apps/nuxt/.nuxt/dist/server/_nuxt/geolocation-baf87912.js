import { ref, mergeProps, useSSRContext } from "vue";
import "hookable";
import "destr";
import { u as useAppConfig } from "../server.mjs";
import { ssrRenderAttrs } from "vue/server-renderer";
import mapboxgl from "mapbox-gl";
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
const mapboxGl = "";
const geolocation_vue_vue_type_style_index_0_lang = "";
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
export {
  _sfc_main as default
};
//# sourceMappingURL=geolocation-baf87912.js.map
