import { ref, onUnmounted, mergeProps, unref, useSSRContext } from "vue";
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
const rust_vue_vue_type_style_index_0_scoped_d83f12f2_lang = "";
const _sfc_main = {
  __name: "rust",
  __ssrInlineRender: true,
  setup(__props) {
    ref(null);
    const {
      public: { rust: rust2, BITS_PER_BYTE }
    } = useAppConfig();
    const container = ref(null);
    let game = null;
    let gameLoopID = null;
    const isPlaying = ref(false);
    ref(null);
    rust2.sizeCell + 1;
    onUnmounted(() => {
      pauseGame();
      game.destroy();
    });
    function pauseGame() {
      cancelAnimationFrame(gameLoopID);
      isPlaying.value = false;
      gameLoopID = null;
    }
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(mergeProps({
        class: "Game__container",
        ref_key: "container",
        ref: container
      }, _attrs))} data-v-d83f12f2><canvas class="Game" data-v-d83f12f2></canvas><div class="Game__controlsContainer" data-v-d83f12f2>`);
      if (unref(isPlaying)) {
        _push(`<button data-v-d83f12f2> ⏸ pause </button>`);
      } else {
        _push(`<button variant="primary" data-v-d83f12f2> ▶️ play </button>`);
      }
      _push(`</div></div>`);
    };
  }
};
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/rust.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const rust = /* @__PURE__ */ _export_sfc(_sfc_main, [["__scopeId", "data-v-d83f12f2"]]);
export {
  rust as default
};
//# sourceMappingURL=rust-81a3203e.js.map
