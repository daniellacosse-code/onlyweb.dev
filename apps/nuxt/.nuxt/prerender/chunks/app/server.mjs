import { getCurrentInstance, version, reactive, inject, ref, watchEffect, watch, defineComponent, computed, h, resolveComponent, createApp, unref, useSSRContext, provide, onErrorCaptured, onServerPrefetch, toRef, shallowRef, isReadonly, defineAsyncComponent, isRef, withCtx, createTextVNode, toDisplayString, createVNode, nextTick, Suspense, Transition } from 'file:///Users/daniellacosse/code/only-web/node_modules/vue/index.mjs';
import { $fetch } from 'file:///Users/daniellacosse/code/only-web/node_modules/ofetch/dist/node.mjs';
import { createHooks } from 'file:///Users/daniellacosse/code/only-web/node_modules/hookable/dist/index.mjs';
import { getContext, executeAsync } from 'file:///Users/daniellacosse/code/only-web/node_modules/unctx/dist/index.mjs';
import { renderSSRHead } from 'file:///Users/daniellacosse/code/only-web/node_modules/@unhead/ssr/dist/index.mjs';
import { getActiveHead, createServerHead as createServerHead$1 } from 'file:///Users/daniellacosse/code/only-web/node_modules/unhead/dist/index.mjs';
import { defineHeadPlugin } from 'file:///Users/daniellacosse/code/only-web/node_modules/@unhead/shared/dist/index.mjs';
import { createMemoryHistory, createRouter, RouterView } from 'file:///Users/daniellacosse/code/only-web/node_modules/vue-router/dist/vue-router.node.mjs';
import { createError as createError$1, sendRedirect, setResponseStatus as setResponseStatus$1 } from 'file:///Users/daniellacosse/code/only-web/node_modules/h3/dist/index.mjs';
import { hasProtocol, parseURL, parseQuery, withTrailingSlash, withoutTrailingSlash, joinURL, isEqual } from 'file:///Users/daniellacosse/code/only-web/node_modules/ufo/dist/index.mjs';
import { ssrRenderSuspense, ssrRenderComponent, ssrInterpolate, ssrRenderAttrs, ssrRenderAttr, ssrRenderList, ssrRenderClass } from 'file:///Users/daniellacosse/code/only-web/node_modules/vue/server-renderer/index.mjs';
import { defu } from 'file:///Users/daniellacosse/code/only-web/node_modules/defu/dist/defu.mjs';
import { a as useRuntimeConfig$1 } from '../nitro/nitro-prerenderer.mjs';
import 'file:///Users/daniellacosse/code/only-web/node_modules/node-fetch-native/dist/polyfill.mjs';
import 'file:///Users/daniellacosse/code/only-web/node_modules/destr/dist/index.mjs';
import 'file:///Users/daniellacosse/code/only-web/node_modules/unenv/runtime/fetch/index.mjs';
import 'file:///Users/daniellacosse/code/only-web/node_modules/scule/dist/index.mjs';
import 'file:///Users/daniellacosse/code/only-web/node_modules/ohash/dist/index.mjs';
import 'file:///Users/daniellacosse/code/only-web/node_modules/unstorage/dist/index.mjs';
import 'file:///Users/daniellacosse/code/only-web/node_modules/unstorage/drivers/fs.mjs';
import 'file:///Users/daniellacosse/code/only-web/node_modules/nitropack/node_modules/radix3/dist/index.mjs';

const appConfig = useRuntimeConfig$1().app;
const baseURL = () => appConfig.baseURL;
const nuxtAppCtx = /* @__PURE__ */ getContext("nuxt-app");
const NuxtPluginIndicator = "__nuxt_plugin";
function createNuxtApp(options) {
  let hydratingCount = 0;
  const nuxtApp = {
    provide: void 0,
    globalName: "nuxt",
    versions: {
      get nuxt() {
        return "3.3.3";
      },
      get vue() {
        return nuxtApp.vueApp.version;
      }
    },
    payload: reactive({
      data: {},
      state: {},
      _errors: {},
      ...{ serverRendered: true }
    }),
    static: {
      data: {}
    },
    isHydrating: false,
    deferHydration() {
      if (!nuxtApp.isHydrating) {
        return () => {
        };
      }
      hydratingCount++;
      let called = false;
      return () => {
        if (called) {
          return;
        }
        called = true;
        hydratingCount--;
        if (hydratingCount === 0) {
          nuxtApp.isHydrating = false;
          return nuxtApp.callHook("app:suspense:resolve");
        }
      };
    },
    _asyncDataPromises: {},
    _asyncData: {},
    ...options
  };
  nuxtApp.hooks = createHooks();
  nuxtApp.hook = nuxtApp.hooks.hook;
  {
    async function contextCaller(hooks, args) {
      for (const hook of hooks) {
        await nuxtAppCtx.call(nuxtApp, () => hook(...args));
      }
    }
    nuxtApp.hooks.callHook = (name, ...args) => nuxtApp.hooks.callHookWith(contextCaller, name, ...args);
  }
  nuxtApp.callHook = nuxtApp.hooks.callHook;
  nuxtApp.provide = (name, value) => {
    const $name = "$" + name;
    defineGetter(nuxtApp, $name, value);
    defineGetter(nuxtApp.vueApp.config.globalProperties, $name, value);
  };
  defineGetter(nuxtApp.vueApp, "$nuxt", nuxtApp);
  defineGetter(nuxtApp.vueApp.config.globalProperties, "$nuxt", nuxtApp);
  {
    if (nuxtApp.ssrContext) {
      nuxtApp.ssrContext.nuxt = nuxtApp;
    }
    nuxtApp.ssrContext = nuxtApp.ssrContext || {};
    if (nuxtApp.ssrContext.payload) {
      Object.assign(nuxtApp.payload, nuxtApp.ssrContext.payload);
    }
    nuxtApp.ssrContext.payload = nuxtApp.payload;
    nuxtApp.payload.config = {
      public: options.ssrContext.runtimeConfig.public,
      app: options.ssrContext.runtimeConfig.app
    };
  }
  const runtimeConfig = options.ssrContext.runtimeConfig;
  const compatibilityConfig = new Proxy(runtimeConfig, {
    get(target, prop) {
      if (prop === "public") {
        return target.public;
      }
      return target[prop] ?? target.public[prop];
    },
    set(target, prop, value) {
      {
        return false;
      }
    }
  });
  nuxtApp.provide("config", compatibilityConfig);
  return nuxtApp;
}
async function applyPlugin(nuxtApp, plugin) {
  if (typeof plugin !== "function") {
    return;
  }
  const { provide: provide2 } = await callWithNuxt(nuxtApp, plugin, [nuxtApp]) || {};
  if (provide2 && typeof provide2 === "object") {
    for (const key in provide2) {
      nuxtApp.provide(key, provide2[key]);
    }
  }
}
async function applyPlugins(nuxtApp, plugins2) {
  for (const plugin of plugins2) {
    await applyPlugin(nuxtApp, plugin);
  }
}
function normalizePlugins(_plugins2) {
  const plugins2 = _plugins2.map((plugin) => {
    if (typeof plugin !== "function") {
      return null;
    }
    if (plugin.length > 1) {
      return (nuxtApp) => plugin(nuxtApp, nuxtApp.provide);
    }
    return plugin;
  }).filter(Boolean);
  return plugins2;
}
function defineNuxtPlugin(plugin) {
  plugin[NuxtPluginIndicator] = true;
  return plugin;
}
function callWithNuxt(nuxt, setup, args) {
  const fn = () => args ? setup(...args) : setup();
  {
    return nuxtAppCtx.callAsync(nuxt, fn);
  }
}
function useNuxtApp() {
  const nuxtAppInstance = nuxtAppCtx.tryUse();
  if (!nuxtAppInstance) {
    const vm = getCurrentInstance();
    if (!vm) {
      throw new Error("nuxt instance unavailable");
    }
    return vm.appContext.app.$nuxt;
  }
  return nuxtAppInstance;
}
function useRuntimeConfig() {
  return useNuxtApp().$config;
}
function defineGetter(obj, key, val) {
  Object.defineProperty(obj, key, { get: () => val });
}
function defineAppConfig(config) {
  return config;
}
const components = {};
const components_plugin_KR1HBZs4kY = /* @__PURE__ */ defineNuxtPlugin((nuxtApp) => {
  for (const name in components) {
    nuxtApp.vueApp.component(name, components[name]);
    nuxtApp.vueApp.component("Lazy" + name, components[name]);
  }
});
function resolveUnref(r) {
  return typeof r === "function" ? r() : unref(r);
}
function resolveUnrefHeadInput(ref2, lastKey = "") {
  if (ref2 instanceof Promise)
    return ref2;
  const root = resolveUnref(ref2);
  if (!ref2 || !root)
    return root;
  if (Array.isArray(root))
    return root.map((r) => resolveUnrefHeadInput(r, lastKey));
  if (typeof root === "object") {
    return Object.fromEntries(
      Object.entries(root).map(([k, v]) => {
        if (k === "titleTemplate" || k.startsWith("on"))
          return [k, unref(v)];
        return [k, resolveUnrefHeadInput(v, k)];
      })
    );
  }
  return root;
}
const Vue3 = version.startsWith("3");
const headSymbol = "usehead";
function injectHead() {
  return getCurrentInstance() && inject(headSymbol) || getActiveHead();
}
function vueInstall(head) {
  const plugin = {
    install(app) {
      if (Vue3) {
        app.config.globalProperties.$unhead = head;
        app.config.globalProperties.$head = head;
        app.provide(headSymbol, head);
      }
    }
  };
  return plugin.install;
}
function createServerHead(options = {}) {
  const head = createServerHead$1({
    ...options,
    plugins: [
      VueReactiveUseHeadPlugin(),
      ...(options == null ? void 0 : options.plugins) || []
    ]
  });
  head.install = vueInstall(head);
  return head;
}
const VueReactiveUseHeadPlugin = () => {
  return defineHeadPlugin({
    hooks: {
      "entries:resolve": function(ctx) {
        for (const entry2 of ctx.entries)
          entry2.resolvedInput = resolveUnrefHeadInput(entry2.input);
      }
    }
  });
};
function clientUseHead(input, options = {}) {
  const head = injectHead();
  const deactivated = ref(false);
  const resolvedInput = ref({});
  watchEffect(() => {
    resolvedInput.value = deactivated.value ? {} : resolveUnrefHeadInput(input);
  });
  const entry2 = head.push(resolvedInput.value, options);
  watch(resolvedInput, (e) => {
    entry2.patch(e);
  });
  getCurrentInstance();
  return entry2;
}
function serverUseHead(input, options = {}) {
  const head = injectHead();
  return head.push(input, options);
}
function useHead(input, options = {}) {
  var _a;
  const head = injectHead();
  if (head) {
    const isBrowser = !!((_a = head.resolvedOptions) == null ? void 0 : _a.document);
    if (options.mode === "server" && isBrowser || options.mode === "client" && !isBrowser)
      return;
    return isBrowser ? clientUseHead(input, options) : serverUseHead(input, options);
  }
}
const appPageTransition = false;
const appHead = { "meta": [{ "name": "viewport", "content": "width=device-width, initial-scale=1" }, { "charset": "utf-8" }], "link": [], "style": [], "script": [], "noscript": [] };
const appKeepalive = false;
const unhead_neSs9z3UJp = /* @__PURE__ */ defineNuxtPlugin((nuxtApp) => {
  const createHead = createServerHead;
  const head = createHead();
  head.push(appHead);
  nuxtApp.vueApp.use(head);
  {
    nuxtApp.ssrContext.renderMeta = async () => {
      const meta = await renderSSRHead(head);
      return {
        ...meta,
        bodyScriptsPrepend: meta.bodyTagsOpen,
        // resolves naming difference with NuxtMeta and Unhead
        bodyScripts: meta.bodyTags
      };
    };
  }
});
function polyfillAsVueUseHead(head) {
  const polyfilled = head;
  polyfilled.headTags = head.resolveTags;
  polyfilled.addEntry = head.push;
  polyfilled.addHeadObjs = head.push;
  polyfilled.addReactiveEntry = (input, options) => {
    const api = useHead(input, options);
    if (typeof api !== "undefined")
      return api.dispose;
    return () => {
    };
  };
  polyfilled.removeHeadObjs = () => {
  };
  polyfilled.updateDOM = () => {
    head.hooks.callHook("entries:updated", head);
  };
  polyfilled.unhead = head;
  return polyfilled;
}
const vueuse_head_polyfill_LVXLULr4zk = /* @__PURE__ */ defineNuxtPlugin((nuxtApp) => {
  polyfillAsVueUseHead(nuxtApp.vueApp._context.provides.usehead);
});
function useState(...args) {
  const autoKey = typeof args[args.length - 1] === "string" ? args.pop() : void 0;
  if (typeof args[0] !== "string") {
    args.unshift(autoKey);
  }
  const [_key, init] = args;
  if (!_key || typeof _key !== "string") {
    throw new TypeError("[nuxt] [useState] key must be a string: " + _key);
  }
  if (init !== void 0 && typeof init !== "function") {
    throw new Error("[nuxt] [useState] init must be a function: " + init);
  }
  const key = "$s" + _key;
  const nuxt = useNuxtApp();
  const state = toRef(nuxt.payload.state, key);
  if (state.value === void 0 && init) {
    const initialValue = init();
    if (isRef(initialValue)) {
      nuxt.payload.state[key] = initialValue;
      return initialValue;
    }
    state.value = initialValue;
  }
  return state;
}
function useRequestEvent(nuxtApp = useNuxtApp()) {
  var _a;
  return (_a = nuxtApp.ssrContext) == null ? void 0 : _a.event;
}
function setResponseStatus(arg1, arg2, arg3) {
  if (arg1 && typeof arg1 !== "number") {
    return setResponseStatus$1(arg1, arg2, arg3);
  }
  return setResponseStatus$1(useRequestEvent(), arg1, arg2);
}
const useRouter = () => {
  var _a;
  return (_a = useNuxtApp()) == null ? void 0 : _a.$router;
};
const useRoute = () => {
  if (getCurrentInstance()) {
    return inject("_route", useNuxtApp()._route);
  }
  return useNuxtApp()._route;
};
const defineNuxtRouteMiddleware = (middleware) => middleware;
const isProcessingMiddleware = () => {
  try {
    if (useNuxtApp()._processingMiddleware) {
      return true;
    }
  } catch {
    return true;
  }
  return false;
};
const navigateTo = (to, options) => {
  if (!to) {
    to = "/";
  }
  const toPath = typeof to === "string" ? to : to.path || "/";
  const isExternal = (options == null ? void 0 : options.external) || hasProtocol(toPath, { acceptRelative: true });
  if (isExternal && !(options == null ? void 0 : options.external)) {
    throw new Error("Navigating to external URL is not allowed by default. Use `navigateTo (url, { external: true })`.");
  }
  if (isExternal && parseURL(toPath).protocol === "script:") {
    throw new Error("Cannot navigate to an URL with script protocol.");
  }
  const router = useRouter();
  {
    const nuxtApp = useNuxtApp();
    if (nuxtApp.ssrContext && nuxtApp.ssrContext.event) {
      if (isProcessingMiddleware() && !isExternal) {
        setResponseStatus(nuxtApp.ssrContext.event, (options == null ? void 0 : options.redirectCode) || 302);
        return to;
      }
      const redirectLocation = isExternal ? toPath : joinURL(useRuntimeConfig().app.baseURL, router.resolve(to).fullPath || "/");
      return nuxtApp.callHook("app:redirected").then(() => sendRedirect(nuxtApp.ssrContext.event, redirectLocation, (options == null ? void 0 : options.redirectCode) || 302));
    }
  }
  if (isExternal) {
    if (options == null ? void 0 : options.replace) {
      location.replace(toPath);
    } else {
      location.href = toPath;
    }
    return Promise.resolve();
  }
  return (options == null ? void 0 : options.replace) ? router.replace(to) : router.push(to);
};
const useError = () => toRef(useNuxtApp().payload, "error");
const showError = (_err) => {
  const err = createError(_err);
  try {
    const nuxtApp = useNuxtApp();
    nuxtApp.callHook("app:error", err);
    const error = useError();
    error.value = error.value || err;
  } catch {
    throw err;
  }
  return err;
};
const createError = (err) => {
  const _err = createError$1(err);
  _err.__nuxt_error = true;
  return _err;
};
const _routes = [
  {
    name: "3D",
    path: "/3D",
    meta: {},
    alias: [],
    redirect: void 0,
    component: () => import('./_nuxt/3D-db314143.mjs').then((m) => m.default || m)
  },
  {
    name: "geolocation",
    path: "/geolocation",
    meta: {},
    alias: [],
    redirect: void 0,
    component: () => import('./_nuxt/geolocation-baf87912.mjs').then((m) => m.default || m)
  },
  {
    name: "index",
    path: "/",
    meta: {},
    alias: [],
    redirect: void 0,
    component: () => import('./_nuxt/index-964e6005.mjs').then((m) => m.default || m)
  },
  {
    name: "music",
    path: "/music",
    meta: {},
    alias: [],
    redirect: void 0,
    component: () => import('./_nuxt/music-9f206da2.mjs').then((m) => m.default || m)
  },
  {
    name: "rust",
    path: "/rust",
    meta: {},
    alias: [],
    redirect: void 0,
    component: () => import('./_nuxt/rust-81a3203e.mjs').then((m) => m.default || m)
  },
  {
    name: "scanner",
    path: "/scanner",
    meta: {},
    alias: [],
    redirect: void 0,
    component: () => import('./_nuxt/scanner-0ce0b329.mjs').then((m) => m.default || m)
  }
];
const routerOptions0 = {
  scrollBehavior(to, from, savedPosition) {
    const nuxtApp = useNuxtApp();
    let position = savedPosition || void 0;
    if (!position && from && to && to.meta.scrollToTop !== false && _isDifferentRoute(from, to)) {
      position = { left: 0, top: 0 };
    }
    if (to.path === from.path) {
      if (from.hash && !to.hash) {
        return { left: 0, top: 0 };
      }
      if (to.hash) {
        return { el: to.hash, top: _getHashElementScrollMarginTop(to.hash) };
      }
    }
    const hasTransition = (route) => !!(route.meta.pageTransition ?? appPageTransition);
    const hookToWait = hasTransition(from) && hasTransition(to) ? "page:transition:finish" : "page:finish";
    return new Promise((resolve) => {
      nuxtApp.hooks.hookOnce(hookToWait, async () => {
        await nextTick();
        if (to.hash) {
          position = { el: to.hash, top: _getHashElementScrollMarginTop(to.hash) };
        }
        resolve(position);
      });
    });
  }
};
function _getHashElementScrollMarginTop(selector) {
  try {
    const elem = document.querySelector(selector);
    if (elem) {
      return parseFloat(getComputedStyle(elem).scrollMarginTop);
    }
  } catch {
  }
  return 0;
}
function _isDifferentRoute(a, b) {
  const samePageComponent = a.matched[0] === b.matched[0];
  if (!samePageComponent) {
    return true;
  }
  if (samePageComponent && JSON.stringify(a.params) !== JSON.stringify(b.params)) {
    return true;
  }
  return false;
}
const configRouterOptions = {};
const routerOptions = {
  ...configRouterOptions,
  ...routerOptions0
};
const validate = /* @__PURE__ */ defineNuxtRouteMiddleware(async (to) => {
  var _a;
  let __temp, __restore;
  if (!((_a = to.meta) == null ? void 0 : _a.validate)) {
    return;
  }
  useNuxtApp();
  useRouter();
  const result = ([__temp, __restore] = executeAsync(() => Promise.resolve(to.meta.validate(to))), __temp = await __temp, __restore(), __temp);
  if (result === true) {
    return;
  }
  {
    return result;
  }
});
const globalMiddleware = [
  validate
];
const namedMiddleware = {};
const router_VeD7Ba96AP = /* @__PURE__ */ defineNuxtPlugin(async (nuxtApp) => {
  var _a, _b;
  let __temp, __restore;
  let routerBase = useRuntimeConfig().app.baseURL;
  if (routerOptions.hashMode && !routerBase.includes("#")) {
    routerBase += "#";
  }
  const history = ((_a = routerOptions.history) == null ? void 0 : _a.call(routerOptions, routerBase)) ?? createMemoryHistory(routerBase);
  const routes = ((_b = routerOptions.routes) == null ? void 0 : _b.call(routerOptions, _routes)) ?? _routes;
  const initialURL = nuxtApp.ssrContext.url;
  const router = createRouter({
    ...routerOptions,
    history,
    routes
  });
  nuxtApp.vueApp.use(router);
  const previousRoute = shallowRef(router.currentRoute.value);
  router.afterEach((_to, from) => {
    previousRoute.value = from;
  });
  Object.defineProperty(nuxtApp.vueApp.config.globalProperties, "previousRoute", {
    get: () => previousRoute.value
  });
  const _route = shallowRef(router.resolve(initialURL));
  const syncCurrentRoute = () => {
    _route.value = router.currentRoute.value;
  };
  nuxtApp.hook("page:finish", syncCurrentRoute);
  router.afterEach((to, from) => {
    var _a2, _b2, _c, _d;
    if (((_b2 = (_a2 = to.matched[0]) == null ? void 0 : _a2.components) == null ? void 0 : _b2.default) === ((_d = (_c = from.matched[0]) == null ? void 0 : _c.components) == null ? void 0 : _d.default)) {
      syncCurrentRoute();
    }
  });
  const route = {};
  for (const key in _route.value) {
    route[key] = computed(() => _route.value[key]);
  }
  nuxtApp._route = reactive(route);
  nuxtApp._middleware = nuxtApp._middleware || {
    global: [],
    named: {}
  };
  useError();
  try {
    if (true) {
      ;
      [__temp, __restore] = executeAsync(() => router.push(initialURL)), await __temp, __restore();
      ;
    }
    ;
    [__temp, __restore] = executeAsync(() => router.isReady()), await __temp, __restore();
    ;
  } catch (error2) {
    [__temp, __restore] = executeAsync(() => callWithNuxt(nuxtApp, showError, [error2])), await __temp, __restore();
  }
  const initialLayout = useState("_layout");
  router.beforeEach(async (to, from) => {
    var _a2;
    to.meta = reactive(to.meta);
    if (nuxtApp.isHydrating && initialLayout.value && !isReadonly(to.meta.layout)) {
      to.meta.layout = initialLayout.value;
    }
    nuxtApp._processingMiddleware = true;
    const middlewareEntries = /* @__PURE__ */ new Set([...globalMiddleware, ...nuxtApp._middleware.global]);
    for (const component of to.matched) {
      const componentMiddleware = component.meta.middleware;
      if (!componentMiddleware) {
        continue;
      }
      if (Array.isArray(componentMiddleware)) {
        for (const entry2 of componentMiddleware) {
          middlewareEntries.add(entry2);
        }
      } else {
        middlewareEntries.add(componentMiddleware);
      }
    }
    for (const entry2 of middlewareEntries) {
      const middleware = typeof entry2 === "string" ? nuxtApp._middleware.named[entry2] || await ((_a2 = namedMiddleware[entry2]) == null ? void 0 : _a2.call(namedMiddleware).then((r) => r.default || r)) : entry2;
      if (!middleware) {
        throw new Error(`Unknown route middleware: '${entry2}'.`);
      }
      const result = await callWithNuxt(nuxtApp, middleware, [to, from]);
      {
        if (result === false || result instanceof Error) {
          const error2 = result || createError$1({
            statusCode: 404,
            statusMessage: `Page Not Found: ${initialURL}`
          });
          await callWithNuxt(nuxtApp, showError, [error2]);
          return false;
        }
      }
      if (result || result === false) {
        return result;
      }
    }
  });
  router.afterEach(async (to) => {
    delete nuxtApp._processingMiddleware;
    if (to.matched.length === 0) {
      await callWithNuxt(nuxtApp, showError, [createError$1({
        statusCode: 404,
        fatal: false,
        statusMessage: `Page not found: ${to.fullPath}`
      })]);
    } else {
      const currentURL = to.fullPath || "/";
      if (!isEqual(currentURL, initialURL, { trailingSlash: true })) {
        const event = await callWithNuxt(nuxtApp, useRequestEvent);
        const options = { redirectCode: event.node.res.statusCode !== 200 ? event.node.res.statusCode || 302 : 302 };
        await callWithNuxt(nuxtApp, navigateTo, [currentURL, options]);
      }
    }
  });
  nuxtApp.hooks.hookOnce("app:created", async () => {
    try {
      await router.replace({
        ...router.resolve(initialURL),
        name: void 0,
        // #4920, #$4982
        force: true
      });
    } catch (error2) {
      await callWithNuxt(nuxtApp, showError, [error2]);
    }
  });
  return { provide: { router } };
});
const _plugins = [
  components_plugin_KR1HBZs4kY,
  unhead_neSs9z3UJp,
  vueuse_head_polyfill_LVXLULr4zk,
  router_VeD7Ba96AP
];
const removeUndefinedProps = (props) => Object.fromEntries(Object.entries(props).filter(([, value]) => value !== void 0));
const setupForUseMeta = (metaFactory, renderChild) => (props, ctx) => {
  useHead(() => metaFactory({ ...removeUndefinedProps(props), ...ctx.attrs }, ctx));
  return () => {
    var _a, _b;
    return renderChild ? (_b = (_a = ctx.slots).default) == null ? void 0 : _b.call(_a) : null;
  };
};
const globalProps = {
  accesskey: String,
  autocapitalize: String,
  autofocus: {
    type: Boolean,
    default: void 0
  },
  class: [String, Object, Array],
  contenteditable: {
    type: Boolean,
    default: void 0
  },
  contextmenu: String,
  dir: String,
  draggable: {
    type: Boolean,
    default: void 0
  },
  enterkeyhint: String,
  exportparts: String,
  hidden: {
    type: Boolean,
    default: void 0
  },
  id: String,
  inputmode: String,
  is: String,
  itemid: String,
  itemprop: String,
  itemref: String,
  itemscope: String,
  itemtype: String,
  lang: String,
  nonce: String,
  part: String,
  slot: String,
  spellcheck: {
    type: Boolean,
    default: void 0
  },
  style: String,
  tabindex: String,
  title: String,
  translate: String
};
const Link = /* @__PURE__ */ defineComponent({
  // eslint-disable-next-line vue/no-reserved-component-names
  name: "Link",
  inheritAttrs: false,
  props: {
    ...globalProps,
    as: String,
    crossorigin: String,
    disabled: Boolean,
    fetchpriority: String,
    href: String,
    hreflang: String,
    imagesizes: String,
    imagesrcset: String,
    integrity: String,
    media: String,
    prefetch: {
      type: Boolean,
      default: void 0
    },
    referrerpolicy: String,
    rel: String,
    sizes: String,
    title: String,
    type: String,
    /** @deprecated **/
    methods: String,
    /** @deprecated **/
    target: String,
    body: Boolean,
    renderPriority: [String, Number]
  },
  setup: setupForUseMeta((link) => ({
    link: [link]
  }))
});
const Title = /* @__PURE__ */ defineComponent({
  // eslint-disable-next-line vue/no-reserved-component-names
  name: "Title",
  inheritAttrs: false,
  setup: setupForUseMeta((_, { slots }) => {
    var _a, _b, _c;
    const title = ((_c = (_b = (_a = slots.default) == null ? void 0 : _a.call(slots)) == null ? void 0 : _b[0]) == null ? void 0 : _c.children) || null;
    return {
      title
    };
  })
});
const Meta = /* @__PURE__ */ defineComponent({
  // eslint-disable-next-line vue/no-reserved-component-names
  name: "Meta",
  inheritAttrs: false,
  props: {
    ...globalProps,
    charset: String,
    content: String,
    httpEquiv: String,
    name: String,
    body: Boolean,
    renderPriority: [String, Number]
  },
  setup: setupForUseMeta((props) => {
    const meta = { ...props };
    if (meta.httpEquiv) {
      meta["http-equiv"] = meta.httpEquiv;
      delete meta.httpEquiv;
    }
    return {
      meta: [meta]
    };
  })
});
const Head = /* @__PURE__ */ defineComponent({
  // eslint-disable-next-line vue/no-reserved-component-names
  name: "Head",
  inheritAttrs: false,
  setup: (_props, ctx) => () => {
    var _a, _b;
    return (_b = (_a = ctx.slots).default) == null ? void 0 : _b.call(_a);
  }
});
const __nuxt_component_4 = /* @__PURE__ */ defineComponent({
  name: "NuxtLoadingIndicator",
  props: {
    throttle: {
      type: Number,
      default: 200
    },
    duration: {
      type: Number,
      default: 2e3
    },
    height: {
      type: Number,
      default: 3
    },
    color: {
      type: [String, Boolean],
      default: "repeating-linear-gradient(to right,#00dc82 0%,#34cdfe 50%,#0047e1 100%)"
    }
  },
  setup(props, { slots }) {
    const indicator = useLoadingIndicator({
      duration: props.duration,
      throttle: props.throttle
    });
    const nuxtApp = useNuxtApp();
    nuxtApp.hook("page:start", indicator.start);
    nuxtApp.hook("page:finish", indicator.finish);
    return () => h("div", {
      class: "nuxt-loading-indicator",
      style: {
        position: "fixed",
        top: 0,
        right: 0,
        left: 0,
        pointerEvents: "none",
        width: "auto",
        height: `${props.height}px`,
        opacity: indicator.isLoading.value ? 1 : 0,
        background: props.color || void 0,
        backgroundSize: `${100 / indicator.progress.value * 100}% auto`,
        transform: `scaleX(${indicator.progress.value}%)`,
        transformOrigin: "left",
        transition: "transform 0.1s, height 0.4s, opacity 0.4s",
        zIndex: 999999
      }
    }, slots);
  }
});
function useLoadingIndicator(opts) {
  const progress = ref(0);
  const isLoading = ref(false);
  computed(() => 1e4 / opts.duration);
  let _timer = null;
  let _throttle = null;
  function start() {
    clear();
    progress.value = 0;
    if (opts.throttle && false) {
      _throttle = setTimeout(() => {
        isLoading.value = true;
      }, opts.throttle);
    } else {
      isLoading.value = true;
    }
  }
  function finish() {
    progress.value = 100;
    _hide();
  }
  function clear() {
    clearInterval(_timer);
    clearTimeout(_throttle);
    _timer = null;
    _throttle = null;
  }
  function _hide() {
    clear();
  }
  return {
    progress,
    isLoading,
    start,
    finish,
    clear
  };
}
const firstNonUndefined = (...args) => args.find((arg) => arg !== void 0);
const DEFAULT_EXTERNAL_REL_ATTRIBUTE = "noopener noreferrer";
function defineNuxtLink(options) {
  const componentName = options.componentName || "NuxtLink";
  const resolveTrailingSlashBehavior = (to, resolve) => {
    if (!to || options.trailingSlash !== "append" && options.trailingSlash !== "remove") {
      return to;
    }
    const normalizeTrailingSlash = options.trailingSlash === "append" ? withTrailingSlash : withoutTrailingSlash;
    if (typeof to === "string") {
      return normalizeTrailingSlash(to, true);
    }
    const path = "path" in to ? to.path : resolve(to).path;
    return {
      ...to,
      name: void 0,
      // named routes would otherwise always override trailing slash behavior
      path: normalizeTrailingSlash(path, true)
    };
  };
  return /* @__PURE__ */ defineComponent({
    name: componentName,
    props: {
      // Routing
      to: {
        type: [String, Object],
        default: void 0,
        required: false
      },
      href: {
        type: [String, Object],
        default: void 0,
        required: false
      },
      // Attributes
      target: {
        type: String,
        default: void 0,
        required: false
      },
      rel: {
        type: String,
        default: void 0,
        required: false
      },
      noRel: {
        type: Boolean,
        default: void 0,
        required: false
      },
      // Prefetching
      prefetch: {
        type: Boolean,
        default: void 0,
        required: false
      },
      noPrefetch: {
        type: Boolean,
        default: void 0,
        required: false
      },
      // Styling
      activeClass: {
        type: String,
        default: void 0,
        required: false
      },
      exactActiveClass: {
        type: String,
        default: void 0,
        required: false
      },
      prefetchedClass: {
        type: String,
        default: void 0,
        required: false
      },
      // Vue Router's `<RouterLink>` additional props
      replace: {
        type: Boolean,
        default: void 0,
        required: false
      },
      ariaCurrentValue: {
        type: String,
        default: void 0,
        required: false
      },
      // Edge cases handling
      external: {
        type: Boolean,
        default: void 0,
        required: false
      },
      // Slot API
      custom: {
        type: Boolean,
        default: void 0,
        required: false
      }
    },
    setup(props, { slots }) {
      const router = useRouter();
      const to = computed(() => {
        const path = props.to || props.href || "";
        return resolveTrailingSlashBehavior(path, router.resolve);
      });
      const isExternal = computed(() => {
        if (props.external) {
          return true;
        }
        if (props.target && props.target !== "_self") {
          return true;
        }
        if (typeof to.value === "object") {
          return false;
        }
        return to.value === "" || hasProtocol(to.value, { acceptRelative: true });
      });
      const prefetched = ref(false);
      const el = void 0;
      const elRef = void 0;
      return () => {
        var _a, _b;
        if (!isExternal.value) {
          const routerLinkProps = {
            ref: elRef,
            to: to.value,
            activeClass: props.activeClass || options.activeClass,
            exactActiveClass: props.exactActiveClass || options.exactActiveClass,
            replace: props.replace,
            ariaCurrentValue: props.ariaCurrentValue,
            custom: props.custom
          };
          if (!props.custom) {
            if (prefetched.value) {
              routerLinkProps.class = props.prefetchedClass || options.prefetchedClass;
            }
            routerLinkProps.rel = props.rel;
          }
          return h(
            resolveComponent("RouterLink"),
            routerLinkProps,
            slots.default
          );
        }
        const href = typeof to.value === "object" ? ((_a = router.resolve(to.value)) == null ? void 0 : _a.href) ?? null : to.value || null;
        const target = props.target || null;
        const rel = props.noRel ? null : firstNonUndefined(props.rel, options.externalRelAttribute, href ? DEFAULT_EXTERNAL_REL_ATTRIBUTE : "") || null;
        const navigate = () => navigateTo(href, { replace: props.replace });
        if (props.custom) {
          if (!slots.default) {
            return null;
          }
          return slots.default({
            href,
            navigate,
            get route() {
              if (!href) {
                return void 0;
              }
              const url = parseURL(href);
              return {
                path: url.pathname,
                fullPath: url.pathname,
                get query() {
                  return parseQuery(url.search);
                },
                hash: url.hash,
                // stub properties for compat with vue-router
                params: {},
                name: void 0,
                matched: [],
                redirectedFrom: void 0,
                meta: {},
                href
              };
            },
            rel,
            target,
            isExternal: isExternal.value,
            isActive: false,
            isExactActive: false
          });
        }
        return h("a", { ref: el, href, rel, target }, (_b = slots.default) == null ? void 0 : _b.call(slots));
      };
    }
  });
}
const __nuxt_component_0 = /* @__PURE__ */ defineNuxtLink({ componentName: "NuxtLink" });
const interpolatePath = (route, match) => {
  return match.path.replace(/(:\w+)\([^)]+\)/g, "$1").replace(/(:\w+)[?+*]/g, "$1").replace(/:\w+/g, (r) => {
    var _a;
    return ((_a = route.params[r.slice(1)]) == null ? void 0 : _a.toString()) || "";
  });
};
const generateRouteKey = (routeProps, override) => {
  const matchedRoute = routeProps.route.matched.find((m) => {
    var _a;
    return ((_a = m.components) == null ? void 0 : _a.default) === routeProps.Component.type;
  });
  const source = override ?? (matchedRoute == null ? void 0 : matchedRoute.meta.key) ?? (matchedRoute && interpolatePath(routeProps.route, matchedRoute));
  return typeof source === "function" ? source(routeProps.route) : source;
};
const wrapInKeepAlive = (props, children) => {
  return { default: () => children };
};
const Fragment = /* @__PURE__ */ defineComponent({
  name: "FragmentWrapper",
  setup(_props, { slots }) {
    return () => {
      var _a;
      return (_a = slots.default) == null ? void 0 : _a.call(slots);
    };
  }
});
const _wrapIf = (component, props, slots) => {
  return { default: () => props ? h(component, props === true ? {} : props, slots) : h(Fragment, {}, slots) };
};
const __nuxt_component_6 = /* @__PURE__ */ defineComponent({
  name: "NuxtPage",
  inheritAttrs: false,
  props: {
    name: {
      type: String
    },
    transition: {
      type: [Boolean, Object],
      default: void 0
    },
    keepalive: {
      type: [Boolean, Object],
      default: void 0
    },
    route: {
      type: Object
    },
    pageKey: {
      type: [Function, String],
      default: null
    }
  },
  setup(props, { attrs }) {
    const nuxtApp = useNuxtApp();
    return () => {
      return h(RouterView, { name: props.name, route: props.route, ...attrs }, {
        default: (routeProps) => {
          if (!routeProps.Component) {
            return;
          }
          const key = generateRouteKey(routeProps, props.pageKey);
          const done = nuxtApp.deferHydration();
          const hasTransition = !!(props.transition ?? routeProps.route.meta.pageTransition ?? appPageTransition);
          const transitionProps = hasTransition && _mergeTransitionProps([
            props.transition,
            routeProps.route.meta.pageTransition,
            appPageTransition,
            { onAfterLeave: () => {
              nuxtApp.callHook("page:transition:finish", routeProps.Component);
            } }
          ].filter(Boolean));
          return _wrapIf(
            Transition,
            hasTransition && transitionProps,
            wrapInKeepAlive(
              props.keepalive ?? routeProps.route.meta.keepalive ?? appKeepalive,
              h(Suspense, {
                onPending: () => nuxtApp.callHook("page:start", routeProps.Component),
                onResolve: () => {
                  nextTick(() => nuxtApp.callHook("page:finish", routeProps.Component).finally(done));
                }
              }, { default: () => h(RouteProvider, { key, routeProps, pageKey: key, hasTransition }) })
            )
          ).default();
        }
      });
    };
  }
});
function _toArray(val) {
  return Array.isArray(val) ? val : val ? [val] : [];
}
function _mergeTransitionProps(routeProps) {
  const _props = routeProps.map((prop) => ({
    ...prop,
    onAfterLeave: _toArray(prop.onAfterLeave)
  }));
  return defu(..._props);
}
const RouteProvider = /* @__PURE__ */ defineComponent({
  name: "RouteProvider",
  // TODO: Type props
  // eslint-disable-next-line vue/require-prop-types
  props: ["routeProps", "pageKey", "hasTransition"],
  setup(props) {
    const previousKey = props.pageKey;
    const previousRoute = props.routeProps.route;
    const route = {};
    for (const key in props.routeProps.route) {
      route[key] = computed(() => previousKey === props.pageKey ? props.routeProps.route[key] : previousRoute[key]);
    }
    provide("_route", reactive(route));
    return () => {
      return h(props.routeProps.Component);
    };
  }
});
function isObject(value) {
  return value !== null && typeof value === "object";
}
function _defu(baseObject, defaults, namespace = ".", merger) {
  if (!isObject(defaults)) {
    return _defu(baseObject, {}, namespace, merger);
  }
  const object = Object.assign({}, defaults);
  for (const key in baseObject) {
    if (key === "__proto__" || key === "constructor") {
      continue;
    }
    const value = baseObject[key];
    if (value === null || value === void 0) {
      continue;
    }
    if (merger && merger(object, key, value, namespace)) {
      continue;
    }
    if (Array.isArray(value) && Array.isArray(object[key])) {
      object[key] = [...value, ...object[key]];
    } else if (isObject(value) && isObject(object[key])) {
      object[key] = _defu(
        value,
        object[key],
        (namespace ? `${namespace}.` : "") + key.toString(),
        merger
      );
    } else {
      object[key] = value;
    }
  }
  return object;
}
function createDefu(merger) {
  return (...arguments_) => (
    // eslint-disable-next-line unicorn/no-array-reduce
    arguments_.reduce((p, c) => _defu(p, c, "", merger), {})
  );
}
const defuFn = createDefu((object, key, currentValue) => {
  if (typeof object[key] !== "undefined" && typeof currentValue === "function") {
    object[key] = currentValue(object[key]);
    return true;
  }
});
const cfg0 = defineAppConfig({
  public: {
    // environment: process.env.VERCEL_ENV ?? "prerender",
    BITS_PER_BYTE: 8,
    MILLISECONDS_PER_SECOND: 1e3,
    SECONDS_PER_MINUTE: 60,
    geolocation: {
      locationSearchTimeout: 3e3,
      mapboxStyle: "mapbox://styles/mapbox/streets-v11",
      mapboxToken: process.env.NUXT_ENV_MAPBOX_TOKEN,
      zoomLevelDefault: 3,
      zoomLevelSpecific: 12
    },
    meta: {
      color: "hsl(153, 47%, 49%)",
      description: "the case for only web",
      title: "only web"
    },
    navbar: {
      navIconMap: {
        default: "📄",
        "3D": "📦",
        geolocation: "🗺",
        music: "🎵",
        rust: "🦀",
        scanner: "🤳🏻"
      }
    },
    music: {
      playerBeatsPerMinuteDefault: 100,
      playerChordInstructionsDefault: "I V vi V7/IV IV I ii V7 Isus4 Isus2 I",
      playerNoteReadoutDefault: ["--"]
    },
    rust: {
      colorBackground: "#FFFFFF",
      colorDefault: "#000000",
      sizeCell: 10
    },
    scanner: {
      decoderReaders: ["upc_reader", "upc_e_reader", "qrcode"],
      readoutTextDefault: "[scan data will show here]"
    },
    threeDimensional: {
      colorBackground: { luminance: 0.2 },
      positionCamera: { x: 0, y: 0, z: 6 },
      rotationLight: { x: 45, y: 0, z: 0 },
      rotationSpeedCube: { x: 10, y: 20, z: 30 }
    }
  }
});
const inlineConfig = {};
const __appConfig = /* @__PURE__ */ defuFn(cfg0, inlineConfig);
function useAppConfig() {
  const nuxtApp = useNuxtApp();
  if (!nuxtApp._appConfig) {
    nuxtApp._appConfig = reactive(__appConfig);
  }
  return nuxtApp._appConfig;
}
const _imports_0 = "" + __publicAssetsURL("icon-reverse.png");
const _sfc_main$1 = {
  __name: "app",
  __ssrInlineRender: true,
  setup(__props) {
    const {
      public: { meta, navbar }
    } = useAppConfig();
    const router = useRouter();
    const activeRoute = useRoute();
    let { title, description, color } = meta;
    if (activeRoute.path !== "/") {
      title = `${title} | ${activeRoute.name}`;
      description = `${description} (${activeRoute.name} demo)`;
    }
    return (_ctx, _push, _parent, _attrs) => {
      const _component_Head = Head;
      const _component_Title = Title;
      const _component_Meta = Meta;
      const _component_Link = Link;
      const _component_NuxtLoadingIndicator = __nuxt_component_4;
      const _component_NuxtLink = __nuxt_component_0;
      const _component_NuxtPage = __nuxt_component_6;
      const _cssVars = { style: {
        "--757bece4": unref(color)
      } };
      _push(`<!--[-->`);
      _push(ssrRenderComponent(_component_Head, _cssVars, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(ssrRenderComponent(_component_Title, null, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(`${ssrInterpolate(unref(title))}`);
                } else {
                  return [
                    createTextVNode(toDisplayString(unref(title)), 1)
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
            _push2(ssrRenderComponent(_component_Meta, { charset: "utf-8" }, null, _parent2, _scopeId));
            _push2(ssrRenderComponent(_component_Meta, {
              content: "width=device-width,initial-scale=1,minimal-ui",
              name: "viewport"
            }, null, _parent2, _scopeId));
            _push2(ssrRenderComponent(_component_Meta, {
              content: "yes",
              name: "mobile-web-app-capable"
            }, null, _parent2, _scopeId));
            _push2(ssrRenderComponent(_component_Meta, {
              content: "yes",
              name: "apple-mobile-web-app-capable"
            }, null, _parent2, _scopeId));
            _push2(ssrRenderComponent(_component_Meta, {
              content: "black-transparent",
              name: "apple-mobile-web-app-status-bar-style"
            }, null, _parent2, _scopeId));
            _push2(ssrRenderComponent(_component_Meta, {
              content: unref(title),
              name: "apple-mobile-web-app-title"
            }, null, _parent2, _scopeId));
            _push2(ssrRenderComponent(_component_Meta, {
              content: unref(title),
              name: "og:title"
            }, null, _parent2, _scopeId));
            _push2(ssrRenderComponent(_component_Meta, {
              content: unref(title),
              name: "og:site_name"
            }, null, _parent2, _scopeId));
            _push2(ssrRenderComponent(_component_Meta, {
              content: "website",
              name: "og:type"
            }, null, _parent2, _scopeId));
            _push2(ssrRenderComponent(_component_Meta, {
              content: unref(description),
              name: "description"
            }, null, _parent2, _scopeId));
            _push2(ssrRenderComponent(_component_Meta, {
              content: unref(description),
              name: "og:description"
            }, null, _parent2, _scopeId));
            _push2(ssrRenderComponent(_component_Meta, {
              content: unref(color),
              name: "theme-color"
            }, null, _parent2, _scopeId));
            _push2(ssrRenderComponent(_component_Link, {
              href: "/manifest.json",
              rel: "manifest"
            }, null, _parent2, _scopeId));
            _push2(ssrRenderComponent(_component_Link, {
              href: "/favicon.ico",
              rel: "shortcut icon"
            }, null, _parent2, _scopeId));
            _push2(ssrRenderComponent(_component_Link, {
              href: "/pwa/apple-icon-180.png",
              rel: "apple-touch-icon"
            }, null, _parent2, _scopeId));
            _push2(ssrRenderComponent(_component_Link, {
              href: "/pwa/apple-splash-2048-2732.png",
              media: "(device-width: 1024px) and (device-height: 1366px) and\n    (-webkit-device-pixel-ratio: 2) and (orientation: portrait)",
              rel: "apple-touch-startup-image"
            }, null, _parent2, _scopeId));
            _push2(ssrRenderComponent(_component_Link, {
              href: "/pwa/apple-splash-2732-2048.png",
              media: "(device-width: 1024px) and (device-height: 1366px) and\n    (-webkit-device-pixel-ratio: 2) and (orientation: landscape)",
              rel: "apple-touch-startup-image"
            }, null, _parent2, _scopeId));
            _push2(ssrRenderComponent(_component_Link, {
              href: "/pwa/apple-splash-1668-2388.png",
              media: "(device-width: 834px) and (device-height: 1194px) and\n    (-webkit-device-pixel-ratio: 2) and (orientation: portrait)",
              rel: "apple-touch-startup-image"
            }, null, _parent2, _scopeId));
            _push2(ssrRenderComponent(_component_Link, {
              href: "/pwa/apple-splash-2388-1668.png",
              media: "(device-width: 834px) and (device-height: 1194px) and\n    (-webkit-device-pixel-ratio: 2) and (orientation: landscape)",
              rel: "apple-touch-startup-image"
            }, null, _parent2, _scopeId));
            _push2(ssrRenderComponent(_component_Link, {
              href: "/pwa/apple-splash-1536-2048.png",
              media: "(device-width: 768px) and (device-height: 1024px) and\n    (-webkit-device-pixel-ratio: 2) and (orientation: portrait)",
              rel: "apple-touch-startup-image"
            }, null, _parent2, _scopeId));
            _push2(ssrRenderComponent(_component_Link, {
              href: "/pwa/apple-splash-2048-1536.png",
              media: "(device-width: 768px) and (device-height: 1024px) and\n    (-webkit-device-pixel-ratio: 2) and (orientation: landscape)",
              rel: "apple-touch-startup-image"
            }, null, _parent2, _scopeId));
            _push2(ssrRenderComponent(_component_Link, {
              href: "/pwa/apple-splash-1668-2224.png",
              media: "(device-width: 834px) and (device-height: 1112px) and\n    (-webkit-device-pixel-ratio: 2) and (orientation: portrait)",
              rel: "apple-touch-startup-image"
            }, null, _parent2, _scopeId));
            _push2(ssrRenderComponent(_component_Link, {
              href: "/pwa/apple-splash-2224-1668.png",
              media: "(device-width: 834px) and (device-height: 1112px) and\n    (-webkit-device-pixel-ratio: 2) and (orientation: landscape)",
              rel: "apple-touch-startup-image"
            }, null, _parent2, _scopeId));
            _push2(ssrRenderComponent(_component_Link, {
              href: "/pwa/apple-splash-1620-2160.png",
              media: "(device-width: 810px) and (device-height: 1080px) and\n    (-webkit-device-pixel-ratio: 2) and (orientation: portrait)",
              rel: "apple-touch-startup-image"
            }, null, _parent2, _scopeId));
            _push2(ssrRenderComponent(_component_Link, {
              href: "/pwa/apple-splash-2160-1620.png",
              media: "(device-width: 810px) and (device-height: 1080px) and\n    (-webkit-device-pixel-ratio: 2) and (orientation: landscape)",
              rel: "apple-touch-startup-image"
            }, null, _parent2, _scopeId));
            _push2(ssrRenderComponent(_component_Link, {
              href: "/pwa/apple-splash-1284-2778.png",
              media: "(device-width: 428px) and (device-height: 926px) and\n    (-webkit-device-pixel-ratio: 3) and (orientation: portrait)",
              rel: "apple-touch-startup-image"
            }, null, _parent2, _scopeId));
            _push2(ssrRenderComponent(_component_Link, {
              href: "/pwa/apple-splash-2778-1284.png",
              media: "(device-width: 428px) and (device-height: 926px) and\n    (-webkit-device-pixel-ratio: 3) and (orientation: landscape)",
              rel: "apple-touch-startup-image"
            }, null, _parent2, _scopeId));
            _push2(ssrRenderComponent(_component_Link, {
              href: "/pwa/apple-splash-1170-2532.png",
              media: "(device-width: 390px) and (device-height: 844px) and\n    (-webkit-device-pixel-ratio: 3) and (orientation: portrait)",
              rel: "apple-touch-startup-image"
            }, null, _parent2, _scopeId));
            _push2(ssrRenderComponent(_component_Link, {
              href: "/pwa/apple-splash-2532-1170.png",
              media: "(device-width: 390px) and (device-height: 844px) and\n    (-webkit-device-pixel-ratio: 3) and (orientation: landscape)",
              rel: "apple-touch-startup-image"
            }, null, _parent2, _scopeId));
            _push2(ssrRenderComponent(_component_Link, {
              href: "/pwa/apple-splash-1125-2436.png",
              media: "(device-width: 375px) and (device-height: 812px) and\n    (-webkit-device-pixel-ratio: 3) and (orientation: portrait)",
              rel: "apple-touch-startup-image"
            }, null, _parent2, _scopeId));
            _push2(ssrRenderComponent(_component_Link, {
              href: "/pwa/apple-splash-2436-1125.png",
              media: "(device-width: 375px) and (device-height: 812px) and\n    (-webkit-device-pixel-ratio: 3) and (orientation: landscape)",
              rel: "apple-touch-startup-image"
            }, null, _parent2, _scopeId));
            _push2(ssrRenderComponent(_component_Link, {
              href: "/pwa/apple-splash-1242-2688.png",
              media: "(device-width: 414px) and (device-height: 896px) and\n    (-webkit-device-pixel-ratio: 3) and (orientation: portrait)",
              rel: "apple-touch-startup-image"
            }, null, _parent2, _scopeId));
            _push2(ssrRenderComponent(_component_Link, {
              href: "/pwa/apple-splash-2688-1242.png",
              media: "(device-width: 414px) and (device-height: 896px) and\n    (-webkit-device-pixel-ratio: 3) and (orientation: landscape)",
              rel: "apple-touch-startup-image"
            }, null, _parent2, _scopeId));
            _push2(ssrRenderComponent(_component_Link, {
              href: "/pwa/apple-splash-828-1792.png",
              media: "(device-width: 414px) and (device-height: 896px) and\n    (-webkit-device-pixel-ratio: 2) and (orientation: portrait)",
              rel: "apple-touch-startup-image"
            }, null, _parent2, _scopeId));
            _push2(ssrRenderComponent(_component_Link, {
              href: "/pwa/apple-splash-1792-828.png",
              media: "(device-width: 414px) and (device-height: 896px) and\n    (-webkit-device-pixel-ratio: 2) and (orientation: landscape)",
              rel: "apple-touch-startup-image"
            }, null, _parent2, _scopeId));
            _push2(ssrRenderComponent(_component_Link, {
              href: "/pwa/apple-splash-1242-2208.png",
              media: "(device-width: 414px) and (device-height: 736px) and\n    (-webkit-device-pixel-ratio: 3) and (orientation: portrait)",
              rel: "apple-touch-startup-image"
            }, null, _parent2, _scopeId));
            _push2(ssrRenderComponent(_component_Link, {
              href: "/pwa/apple-splash-2208-1242.png",
              media: "(device-width: 414px) and (device-height: 736px) and\n    (-webkit-device-pixel-ratio: 3) and (orientation: landscape)",
              rel: "apple-touch-startup-image"
            }, null, _parent2, _scopeId));
            _push2(ssrRenderComponent(_component_Link, {
              href: "/pwa/apple-splash-750-1334.png",
              media: "(device-width: 375px) and (device-height: 667px) and\n    (-webkit-device-pixel-ratio: 2) and (orientation: portrait)",
              rel: "apple-touch-startup-image"
            }, null, _parent2, _scopeId));
            _push2(ssrRenderComponent(_component_Link, {
              href: "/pwa/apple-splash-1334-750.png",
              media: "(device-width: 375px) and (device-height: 667px) and\n    (-webkit-device-pixel-ratio: 2) and (orientation: landscape)",
              rel: "apple-touch-startup-image"
            }, null, _parent2, _scopeId));
            _push2(ssrRenderComponent(_component_Link, {
              href: "/pwa/apple-splash-640-1136.png",
              media: "(device-width: 320px) and (device-height: 568px) and\n    (-webkit-device-pixel-ratio: 2) and (orientation: portrait)",
              rel: "apple-touch-startup-image"
            }, null, _parent2, _scopeId));
            _push2(ssrRenderComponent(_component_Link, {
              href: "/pwa/apple-splash-1136-640.png",
              media: "(device-width: 320px) and (device-height: 568px) and\n    (-webkit-device-pixel-ratio: 2) and (orientation: landscape)",
              rel: "apple-touch-startup-image"
            }, null, _parent2, _scopeId));
          } else {
            return [
              createVNode(_component_Title, null, {
                default: withCtx(() => [
                  createTextVNode(toDisplayString(unref(title)), 1)
                ]),
                _: 1
              }),
              createVNode(_component_Meta, { charset: "utf-8" }),
              createVNode(_component_Meta, {
                content: "width=device-width,initial-scale=1,minimal-ui",
                name: "viewport"
              }),
              createVNode(_component_Meta, {
                content: "yes",
                name: "mobile-web-app-capable"
              }),
              createVNode(_component_Meta, {
                content: "yes",
                name: "apple-mobile-web-app-capable"
              }),
              createVNode(_component_Meta, {
                content: "black-transparent",
                name: "apple-mobile-web-app-status-bar-style"
              }),
              createVNode(_component_Meta, {
                content: unref(title),
                name: "apple-mobile-web-app-title"
              }, null, 8, ["content"]),
              createVNode(_component_Meta, {
                content: unref(title),
                name: "og:title"
              }, null, 8, ["content"]),
              createVNode(_component_Meta, {
                content: unref(title),
                name: "og:site_name"
              }, null, 8, ["content"]),
              createVNode(_component_Meta, {
                content: "website",
                name: "og:type"
              }),
              createVNode(_component_Meta, {
                content: unref(description),
                name: "description"
              }, null, 8, ["content"]),
              createVNode(_component_Meta, {
                content: unref(description),
                name: "og:description"
              }, null, 8, ["content"]),
              createVNode(_component_Meta, {
                content: unref(color),
                name: "theme-color"
              }, null, 8, ["content"]),
              createVNode(_component_Link, {
                href: "/manifest.json",
                rel: "manifest"
              }),
              createVNode(_component_Link, {
                href: "/favicon.ico",
                rel: "shortcut icon"
              }),
              createVNode(_component_Link, {
                href: "/pwa/apple-icon-180.png",
                rel: "apple-touch-icon"
              }),
              createVNode(_component_Link, {
                href: "/pwa/apple-splash-2048-2732.png",
                media: "(device-width: 1024px) and (device-height: 1366px) and\n    (-webkit-device-pixel-ratio: 2) and (orientation: portrait)",
                rel: "apple-touch-startup-image"
              }),
              createVNode(_component_Link, {
                href: "/pwa/apple-splash-2732-2048.png",
                media: "(device-width: 1024px) and (device-height: 1366px) and\n    (-webkit-device-pixel-ratio: 2) and (orientation: landscape)",
                rel: "apple-touch-startup-image"
              }),
              createVNode(_component_Link, {
                href: "/pwa/apple-splash-1668-2388.png",
                media: "(device-width: 834px) and (device-height: 1194px) and\n    (-webkit-device-pixel-ratio: 2) and (orientation: portrait)",
                rel: "apple-touch-startup-image"
              }),
              createVNode(_component_Link, {
                href: "/pwa/apple-splash-2388-1668.png",
                media: "(device-width: 834px) and (device-height: 1194px) and\n    (-webkit-device-pixel-ratio: 2) and (orientation: landscape)",
                rel: "apple-touch-startup-image"
              }),
              createVNode(_component_Link, {
                href: "/pwa/apple-splash-1536-2048.png",
                media: "(device-width: 768px) and (device-height: 1024px) and\n    (-webkit-device-pixel-ratio: 2) and (orientation: portrait)",
                rel: "apple-touch-startup-image"
              }),
              createVNode(_component_Link, {
                href: "/pwa/apple-splash-2048-1536.png",
                media: "(device-width: 768px) and (device-height: 1024px) and\n    (-webkit-device-pixel-ratio: 2) and (orientation: landscape)",
                rel: "apple-touch-startup-image"
              }),
              createVNode(_component_Link, {
                href: "/pwa/apple-splash-1668-2224.png",
                media: "(device-width: 834px) and (device-height: 1112px) and\n    (-webkit-device-pixel-ratio: 2) and (orientation: portrait)",
                rel: "apple-touch-startup-image"
              }),
              createVNode(_component_Link, {
                href: "/pwa/apple-splash-2224-1668.png",
                media: "(device-width: 834px) and (device-height: 1112px) and\n    (-webkit-device-pixel-ratio: 2) and (orientation: landscape)",
                rel: "apple-touch-startup-image"
              }),
              createVNode(_component_Link, {
                href: "/pwa/apple-splash-1620-2160.png",
                media: "(device-width: 810px) and (device-height: 1080px) and\n    (-webkit-device-pixel-ratio: 2) and (orientation: portrait)",
                rel: "apple-touch-startup-image"
              }),
              createVNode(_component_Link, {
                href: "/pwa/apple-splash-2160-1620.png",
                media: "(device-width: 810px) and (device-height: 1080px) and\n    (-webkit-device-pixel-ratio: 2) and (orientation: landscape)",
                rel: "apple-touch-startup-image"
              }),
              createVNode(_component_Link, {
                href: "/pwa/apple-splash-1284-2778.png",
                media: "(device-width: 428px) and (device-height: 926px) and\n    (-webkit-device-pixel-ratio: 3) and (orientation: portrait)",
                rel: "apple-touch-startup-image"
              }),
              createVNode(_component_Link, {
                href: "/pwa/apple-splash-2778-1284.png",
                media: "(device-width: 428px) and (device-height: 926px) and\n    (-webkit-device-pixel-ratio: 3) and (orientation: landscape)",
                rel: "apple-touch-startup-image"
              }),
              createVNode(_component_Link, {
                href: "/pwa/apple-splash-1170-2532.png",
                media: "(device-width: 390px) and (device-height: 844px) and\n    (-webkit-device-pixel-ratio: 3) and (orientation: portrait)",
                rel: "apple-touch-startup-image"
              }),
              createVNode(_component_Link, {
                href: "/pwa/apple-splash-2532-1170.png",
                media: "(device-width: 390px) and (device-height: 844px) and\n    (-webkit-device-pixel-ratio: 3) and (orientation: landscape)",
                rel: "apple-touch-startup-image"
              }),
              createVNode(_component_Link, {
                href: "/pwa/apple-splash-1125-2436.png",
                media: "(device-width: 375px) and (device-height: 812px) and\n    (-webkit-device-pixel-ratio: 3) and (orientation: portrait)",
                rel: "apple-touch-startup-image"
              }),
              createVNode(_component_Link, {
                href: "/pwa/apple-splash-2436-1125.png",
                media: "(device-width: 375px) and (device-height: 812px) and\n    (-webkit-device-pixel-ratio: 3) and (orientation: landscape)",
                rel: "apple-touch-startup-image"
              }),
              createVNode(_component_Link, {
                href: "/pwa/apple-splash-1242-2688.png",
                media: "(device-width: 414px) and (device-height: 896px) and\n    (-webkit-device-pixel-ratio: 3) and (orientation: portrait)",
                rel: "apple-touch-startup-image"
              }),
              createVNode(_component_Link, {
                href: "/pwa/apple-splash-2688-1242.png",
                media: "(device-width: 414px) and (device-height: 896px) and\n    (-webkit-device-pixel-ratio: 3) and (orientation: landscape)",
                rel: "apple-touch-startup-image"
              }),
              createVNode(_component_Link, {
                href: "/pwa/apple-splash-828-1792.png",
                media: "(device-width: 414px) and (device-height: 896px) and\n    (-webkit-device-pixel-ratio: 2) and (orientation: portrait)",
                rel: "apple-touch-startup-image"
              }),
              createVNode(_component_Link, {
                href: "/pwa/apple-splash-1792-828.png",
                media: "(device-width: 414px) and (device-height: 896px) and\n    (-webkit-device-pixel-ratio: 2) and (orientation: landscape)",
                rel: "apple-touch-startup-image"
              }),
              createVNode(_component_Link, {
                href: "/pwa/apple-splash-1242-2208.png",
                media: "(device-width: 414px) and (device-height: 736px) and\n    (-webkit-device-pixel-ratio: 3) and (orientation: portrait)",
                rel: "apple-touch-startup-image"
              }),
              createVNode(_component_Link, {
                href: "/pwa/apple-splash-2208-1242.png",
                media: "(device-width: 414px) and (device-height: 736px) and\n    (-webkit-device-pixel-ratio: 3) and (orientation: landscape)",
                rel: "apple-touch-startup-image"
              }),
              createVNode(_component_Link, {
                href: "/pwa/apple-splash-750-1334.png",
                media: "(device-width: 375px) and (device-height: 667px) and\n    (-webkit-device-pixel-ratio: 2) and (orientation: portrait)",
                rel: "apple-touch-startup-image"
              }),
              createVNode(_component_Link, {
                href: "/pwa/apple-splash-1334-750.png",
                media: "(device-width: 375px) and (device-height: 667px) and\n    (-webkit-device-pixel-ratio: 2) and (orientation: landscape)",
                rel: "apple-touch-startup-image"
              }),
              createVNode(_component_Link, {
                href: "/pwa/apple-splash-640-1136.png",
                media: "(device-width: 320px) and (device-height: 568px) and\n    (-webkit-device-pixel-ratio: 2) and (orientation: portrait)",
                rel: "apple-touch-startup-image"
              }),
              createVNode(_component_Link, {
                href: "/pwa/apple-splash-1136-640.png",
                media: "(device-width: 320px) and (device-height: 568px) and\n    (-webkit-device-pixel-ratio: 2) and (orientation: landscape)",
                rel: "apple-touch-startup-image"
              })
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`<main${ssrRenderAttrs(_cssVars)}>`);
      _push(ssrRenderComponent(_component_NuxtLoadingIndicator, null, null, _parent));
      _push(`<header class="Navbar">`);
      _push(ssrRenderComponent(_component_NuxtLink, {
        class: "Navbar__home",
        to: "/"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<img class="Navbar__logo"${ssrRenderAttr("src", _imports_0)} alt="logo"${_scopeId}>`);
          } else {
            return [
              createVNode("img", {
                class: "Navbar__logo",
                src: _imports_0,
                alt: "logo"
              })
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`<nav class="Navbar__nav"><!--[-->`);
      ssrRenderList(unref(router).getRoutes().filter(({ name }) => name !== "index" && name !== "geolocation"), ({ name, path }) => {
        _push(ssrRenderComponent(_component_NuxtLink, {
          class: "Navbar__navItem",
          to: path
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(`<span class="Navbar__navItemIcon"${_scopeId}>${ssrInterpolate(unref(navbar).navIconMap[name] ?? unref(navbar).navIconMap.default)}</span><span class="${ssrRenderClass({
                Navbar__navItemText: true,
                "Navbar__navItemText--active": path === unref(activeRoute).path
              })}"${_scopeId}>${ssrInterpolate(name)}</span>`);
            } else {
              return [
                createVNode("span", { class: "Navbar__navItemIcon" }, toDisplayString(unref(navbar).navIconMap[name] ?? unref(navbar).navIconMap.default), 1),
                createVNode("span", {
                  class: {
                    Navbar__navItemText: true,
                    "Navbar__navItemText--active": path === unref(activeRoute).path
                  }
                }, toDisplayString(name), 3)
              ];
            }
          }),
          _: 2
        }, _parent));
      });
      _push(`<!--]--></nav></header>`);
      _push(ssrRenderComponent(_component_NuxtPage, null, null, _parent));
      _push(`</main><!--]-->`);
    };
  }
};
const _sfc_setup$1 = _sfc_main$1.setup;
_sfc_main$1.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("app.vue");
  return _sfc_setup$1 ? _sfc_setup$1(props, ctx) : void 0;
};
const AppComponent = _sfc_main$1;
const _sfc_main = {
  __name: "nuxt-root",
  __ssrInlineRender: true,
  setup(__props) {
    const ErrorComponent = /* @__PURE__ */ defineAsyncComponent(() => import('./_nuxt/error-component-5ebce829.mjs').then((r) => r.default || r));
    const IslandRenderer = /* @__PURE__ */ defineAsyncComponent(() => import('./_nuxt/island-renderer-18a32cd1.mjs').then((r) => r.default || r));
    const nuxtApp = useNuxtApp();
    nuxtApp.deferHydration();
    provide("_route", useRoute());
    nuxtApp.hooks.callHookWith((hooks) => hooks.map((hook) => hook()), "vue:setup");
    const error = useError();
    onErrorCaptured((err, target, info) => {
      nuxtApp.hooks.callHook("vue:error", err, target, info).catch((hookError) => console.error("[nuxt] Error in `vue:error` hook", hookError));
      {
        const p = callWithNuxt(nuxtApp, showError, [err]);
        onServerPrefetch(() => p);
        return false;
      }
    });
    const { islandContext } = nuxtApp.ssrContext;
    return (_ctx, _push, _parent, _attrs) => {
      ssrRenderSuspense(_push, {
        default: () => {
          if (unref(error)) {
            _push(ssrRenderComponent(unref(ErrorComponent), { error: unref(error) }, null, _parent));
          } else if (unref(islandContext)) {
            _push(ssrRenderComponent(unref(IslandRenderer), { context: unref(islandContext) }, null, _parent));
          } else {
            _push(ssrRenderComponent(unref(AppComponent), null, null, _parent));
          }
        },
        _: 1
      });
    };
  }
};
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("../../node_modules/nuxt/dist/app/components/nuxt-root.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const RootComponent = _sfc_main;
if (!globalThis.$fetch) {
  globalThis.$fetch = $fetch.create({
    baseURL: baseURL()
  });
}
let entry;
const plugins = normalizePlugins(_plugins);
{
  entry = async function createNuxtAppServer(ssrContext) {
    const vueApp = createApp(RootComponent);
    const nuxt = createNuxtApp({ vueApp, ssrContext });
    try {
      await applyPlugins(nuxt, plugins);
      await nuxt.hooks.callHook("app:created", vueApp);
    } catch (err) {
      await nuxt.hooks.callHook("app:error", err);
      nuxt.payload.error = nuxt.payload.error || err;
    }
    return vueApp;
  };
}
const entry$1 = (ctx) => entry(ctx);

export { __nuxt_component_0 as _, useNuxtApp as a, useHead as b, createError as c, entry$1 as default, useAppConfig as u };
//# sourceMappingURL=server.mjs.map
