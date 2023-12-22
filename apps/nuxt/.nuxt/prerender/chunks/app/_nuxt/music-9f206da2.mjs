import { useSSRContext, withAsyncContext, ref, computed, mergeProps, unref } from 'file:///Users/daniellacosse/code/only-web/node_modules/vue/index.mjs';
import { u as useAppConfig } from '../server.mjs';
import { ssrRenderAttrs, ssrRenderList, ssrInterpolate, ssrRenderAttr, ssrIncludeBooleanAttr } from 'file:///Users/daniellacosse/code/only-web/node_modules/vue/server-renderer/index.mjs';
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
  __name: "music",
  __ssrInlineRender: true,
  async setup(__props) {
    let __temp, __restore;
    [__temp, __restore] = withAsyncContext(() => import('./index-4066ff15.mjs')), __temp = await __temp, __restore();
    const {
      public: { music: music2, MILLISECONDS_PER_SECOND, SECONDS_PER_MINUTE }
    } = useAppConfig();
    const isPlaying = ref(false);
    const isPreparingToPlay = ref(false);
    const chordInstructions = ref(music2.playerChordInstructionsDefault);
    ref(null);
    const displayedNotes = ref(music2.playerNoteReadoutDefault);
    const bpm = ref(music2.playerBeatsPerMinuteDefault);
    computed(
      () => MILLISECONDS_PER_SECOND * SECONDS_PER_MINUTE / bpm.value
    );
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "Music" }, _attrs))} data-v-5304176e><div class="MusicNotes__container" data-v-5304176e><ol class="MusicNotes" data-v-5304176e><!--[-->`);
      ssrRenderList(unref(displayedNotes), (note, index) => {
        _push(`<li class="MusicNote" data-v-5304176e>${ssrInterpolate(note)}</li>`);
      });
      _push(`<!--]--></ol></div><fieldset class="MusicInputs" data-v-5304176e><label data-v-5304176e> Chords <textarea type="textarea" data-v-5304176e>${ssrInterpolate(unref(chordInstructions))}</textarea></label><label data-v-5304176e> Beats per minute (BPM) <input class="MusicInput" type="number"${ssrRenderAttr("value", unref(bpm))} min="24" max="300" data-v-5304176e></label></fieldset>`);
      if (unref(isPlaying)) {
        _push(`<button${ssrIncludeBooleanAttr(unref(isPreparingToPlay)) ? " disabled" : ""} data-v-5304176e> \u{1F6D1} cancel </button>`);
      } else {
        _push(`<button data-v-5304176e>\u25B6\uFE0F play</button>`);
      }
      _push(`</div>`);
    };
  }
};
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/music.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const music = /* @__PURE__ */ _export_sfc(_sfc_main, [["__scopeId", "data-v-5304176e"]]);

export { music as default };
//# sourceMappingURL=music-9f206da2.mjs.map
