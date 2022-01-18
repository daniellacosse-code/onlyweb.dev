const TITLE = "only web";
const DESCRIPTION = "the case for only web";
const COLOR = "#42b983";

const meta = [
  { charset: "utf-8" },
  {
    name: "viewport",
    content: "width=device-width,initial-scale=1,minimal-ui"
  },
  {
    name: "mobile-web-app-capable",
    content: "yes"
  },
  {
    name: "apple-mobile-web-app-capable",
    content: "yes"
  },
  {
    name: "apple-mobile-web-app-status-bar-style",
    content: "black-translucent"
  },
  {
    name: "apple-mobile-web-app-title",
    content: TITLE
  },
  {
    name: "description",
    content: DESCRIPTION
  },
  {
    name: "theme-color",
    content: COLOR
  },
  {
    name: "og:type",
    content: "website"
  },
  {
    name: "og:title",
    content: TITLE
  },
  {
    name: "og:site_name",
    content: TITLE
  },
  {
    name: "og:description",
    content: DESCRIPTION
  }
];

const APPLE_TOUCH_STARTUP_IMAGE = "apple-touch-startup-image";

const link = [
  { rel: "manifest", href: "/only/manifest.json" },
  { rel: "shortcut icon", href: "/only/favicon.ico" },
  { rel: "apple-touch-icon", href: "/only/pwa/apple-icon-180.png" },
  {
    rel: APPLE_TOUCH_STARTUP_IMAGE,
    href: "/only/pwa/apple-splash-2048-2732.png",
    media:
      "(device-width: 1024px) and (device-height: 1366px) and (-webkit-device-pixel-ratio: 2) and (orientation: portrait)"
  },
  {
    rel: APPLE_TOUCH_STARTUP_IMAGE,
    href: "/only/pwa/apple-splash-2732-2048.png",
    media:
      "(device-width: 1024px) and (device-height: 1366px) and (-webkit-device-pixel-ratio: 2) and (orientation: landscape)"
  },
  {
    rel: APPLE_TOUCH_STARTUP_IMAGE,
    href: "/only/pwa/apple-splash-1668-2388.png",
    media:
      "(device-width: 834px) and (device-height: 1194px) and (-webkit-device-pixel-ratio: 2) and (orientation: portrait)"
  },
  {
    rel: APPLE_TOUCH_STARTUP_IMAGE,
    href: "/only/pwa/apple-splash-2388-1668.png",
    media:
      "(device-width: 834px) and (device-height: 1194px) and (-webkit-device-pixel-ratio: 2) and (orientation: landscape)"
  },
  {
    rel: APPLE_TOUCH_STARTUP_IMAGE,
    href: "/only/pwa/apple-splash-1536-2048.png",
    media:
      "(device-width: 768px) and (device-height: 1024px) and (-webkit-device-pixel-ratio: 2) and (orientation: portrait)"
  },
  {
    rel: APPLE_TOUCH_STARTUP_IMAGE,
    href: "/only/pwa/apple-splash-2048-1536.png",
    media:
      "(device-width: 768px) and (device-height: 1024px) and (-webkit-device-pixel-ratio: 2) and (orientation: landscape)"
  },
  {
    rel: APPLE_TOUCH_STARTUP_IMAGE,
    href: "/only/pwa/apple-splash-1668-2224.png",
    media:
      "(device-width: 834px) and (device-height: 1112px) and (-webkit-device-pixel-ratio: 2) and (orientation: portrait)"
  },
  {
    rel: APPLE_TOUCH_STARTUP_IMAGE,
    href: "/only/pwa/apple-splash-2224-1668.png",
    media:
      "(device-width: 834px) and (device-height: 1112px) and (-webkit-device-pixel-ratio: 2) and (orientation: landscape)"
  },
  {
    rel: APPLE_TOUCH_STARTUP_IMAGE,
    href: "/only/pwa/apple-splash-1620-2160.png",
    media:
      "(device-width: 810px) and (device-height: 1080px) and (-webkit-device-pixel-ratio: 2) and (orientation: portrait)"
  },
  {
    rel: APPLE_TOUCH_STARTUP_IMAGE,
    href: "/only/pwa/apple-splash-2160-1620.png",
    media:
      "(device-width: 810px) and (device-height: 1080px) and (-webkit-device-pixel-ratio: 2) and (orientation: landscape)"
  },
  {
    rel: APPLE_TOUCH_STARTUP_IMAGE,
    href: "/only/pwa/apple-splash-1284-2778.png",
    media:
      "(device-width: 428px) and (device-height: 926px) and (-webkit-device-pixel-ratio: 3) and (orientation: portrait)"
  },
  {
    rel: APPLE_TOUCH_STARTUP_IMAGE,
    href: "/only/pwa/apple-splash-2778-1284.png",
    media:
      "(device-width: 428px) and (device-height: 926px) and (-webkit-device-pixel-ratio: 3) and (orientation: landscape)"
  },
  {
    rel: APPLE_TOUCH_STARTUP_IMAGE,
    href: "/only/pwa/apple-splash-1170-2532.png",
    media:
      "(device-width: 390px) and (device-height: 844px) and (-webkit-device-pixel-ratio: 3) and (orientation: portrait)"
  },
  {
    rel: APPLE_TOUCH_STARTUP_IMAGE,
    href: "/only/pwa/apple-splash-2532-1170.png",
    media:
      "(device-width: 390px) and (device-height: 844px) and (-webkit-device-pixel-ratio: 3) and (orientation: landscape)"
  },
  {
    rel: APPLE_TOUCH_STARTUP_IMAGE,
    href: "/only/pwa/apple-splash-1125-2436.png",
    media:
      "(device-width: 375px) and (device-height: 812px) and (-webkit-device-pixel-ratio: 3) and (orientation: portrait)"
  },
  {
    rel: APPLE_TOUCH_STARTUP_IMAGE,
    href: "/only/pwa/apple-splash-2436-1125.png",
    media:
      "(device-width: 375px) and (device-height: 812px) and (-webkit-device-pixel-ratio: 3) and (orientation: landscape)"
  },
  {
    rel: APPLE_TOUCH_STARTUP_IMAGE,
    href: "/only/pwa/apple-splash-1242-2688.png",
    media:
      "(device-width: 414px) and (device-height: 896px) and (-webkit-device-pixel-ratio: 3) and (orientation: portrait)"
  },
  {
    rel: APPLE_TOUCH_STARTUP_IMAGE,
    href: "/only/pwa/apple-splash-2688-1242.png",
    media:
      "(device-width: 414px) and (device-height: 896px) and (-webkit-device-pixel-ratio: 3) and (orientation: landscape)"
  },
  {
    rel: APPLE_TOUCH_STARTUP_IMAGE,
    href: "/only/pwa/apple-splash-828-1792.png",
    media:
      "(device-width: 414px) and (device-height: 896px) and (-webkit-device-pixel-ratio: 2) and (orientation: portrait)"
  },
  {
    rel: APPLE_TOUCH_STARTUP_IMAGE,
    href: "/only/pwa/apple-splash-1792-828.png",
    media:
      "(device-width: 414px) and (device-height: 896px) and (-webkit-device-pixel-ratio: 2) and (orientation: landscape)"
  },
  {
    rel: APPLE_TOUCH_STARTUP_IMAGE,
    href: "/only/pwa/apple-splash-1242-2208.png",
    media:
      "(device-width: 414px) and (device-height: 736px) and (-webkit-device-pixel-ratio: 3) and (orientation: portrait)"
  },
  {
    rel: APPLE_TOUCH_STARTUP_IMAGE,
    href: "/only/pwa/apple-splash-2208-1242.png",
    media:
      "(device-width: 414px) and (device-height: 736px) and (-webkit-device-pixel-ratio: 3) and (orientation: landscape)"
  },
  {
    rel: APPLE_TOUCH_STARTUP_IMAGE,
    href: "/only/pwa/apple-splash-750-1334.png",
    media:
      "(device-width: 375px) and (device-height: 667px) and (-webkit-device-pixel-ratio: 2) and (orientation: portrait)"
  },
  {
    rel: APPLE_TOUCH_STARTUP_IMAGE,
    href: "/only/pwa/apple-splash-1334-750.png",
    media:
      "(device-width: 375px) and (device-height: 667px) and (-webkit-device-pixel-ratio: 2) and (orientation: landscape)"
  },
  {
    rel: APPLE_TOUCH_STARTUP_IMAGE,
    href: "/only/pwa/apple-splash-640-1136.png",
    media:
      "(device-width: 320px) and (device-height: 568px) and (-webkit-device-pixel-ratio: 2) and (orientation: portrait)"
  },
  {
    rel: APPLE_TOUCH_STARTUP_IMAGE,
    href: "/only/pwa/apple-splash-1136-640.png",
    media:
      "(device-width: 320px) and (device-height: 568px) and (-webkit-device-pixel-ratio: 2) and (orientation: landscape)"
  }
];

export default {
  meta,
  title: "Only Web",
  htmlAttrs: {
    lang: "en"
  },
  link
};
