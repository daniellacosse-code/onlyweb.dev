import { useSSRContext, ref, onUnmounted, mergeProps, unref } from 'file:///Users/daniellacosse/code/only-web/node_modules/vue/index.mjs';
import { u as useAppConfig } from '../server.mjs';
import { ssrRenderAttrs } from 'file:///Users/daniellacosse/code/only-web/node_modules/vue/server-renderer/index.mjs';
import { _ as _export_sfc } from './_plugin-vue_export-helper-cc2b3d55.mjs';
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
        _push(`<button data-v-d83f12f2> \u23F8 pause </button>`);
      } else {
        _push(`<button variant="primary" data-v-d83f12f2> \u25B6\uFE0F play </button>`);
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

export { rust as default };
//# sourceMappingURL=rust-81a3203e.mjs.map
