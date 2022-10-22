<style>
html,
body {
  width: 100vw;
  height: 100vh;
}

main {
  display: flex;

  --color-default: v-bind(meta.color);
  --color-text: hsl(210, 29%, 24%);
  --color-background: hsl(156, 42%, 95%);
  --color-highlight: hsl(0, 0%, 100%);

  --font-default: "HelveticaNeue", Helvetica, Arial, sans-serif;
  --font-monospace: "Menlo", monospace;

  --size-extra-small: 0.25rem;
  --size-small: 0.5rem;
  --size-default: 1rem;
  --size-medium: 1.5rem;
  --size-large: 2rem;
  --size-extra-large: 3rem;
  --size-huge: 6rem;

  --device-width-mobile: 320px;
  --device-width-tablet: 680px;

  --app-icon-size: 128px;

  /* config orgua.io UI library */
  --oruga-variant-primary: var(--color-default);
}

/* lmao this is wacky */
main,
#__nuxt,
header,
.o-side {
  height: 100%;
}

/* part of me just wants to roll my own sidebar/etc */
.Sidebar__header {
  padding: var(--size-default);
  text-align: right;
}

.Sidebar__logo {
  max-width: var(--app-icon-size);
  width: 100%;
  cursor: pointer;
}

.Sidebar__nav {
  margin: var(--size-large) 0;
}

.Sidebar__navItem {
  display: block;
  font-weight: bold;
  font-family: var(--font-default);
  text-align: right;
  font-size: var(--size-medium);
  line-height: var(--size-extra-large);
  height: var(--size-extra-large);
  color: var(--color-highlight);
  padding: 0 var(--size-default);
  cursor: pointer;
  text-overflow: ellipsis;
  overflow: hidden;
}

.Sidebar__navItem:hover,
.Sidebar__nav>.router-link-active {
  background: var(--color-highlight);
  color: var(--color-default);
}
</style>

<script setup>
const { public: { meta } } = useRuntimeConfig();
const router = useRouter();

// ISSUE #81: redo service worker
</script>

<template>

  <Head>
    <Title>{{ meta.title }}</Title>

    <Meta charset="utf-8" />
    <Meta content="width=device-width,initial-scale=1,minimal-ui"
      name="viewport" />

    <Meta content="yes" name="mobile-web-app-capable" />
    <Meta content="yes" name="apple-mobile-web-app-capable" />
    <Meta content="black-translucent"
      name="apple-mobile-web-app-status-bar-style" />
    <Meta :content="meta.title" name="apple-mobile-web-app-title" />
    <Meta :content="meta.description" name="description" />
    <Meta :content="meta.color" name="theme-color" />
    <Meta content="website" name="og:type" />
    <Meta :content="meta.title" name="og:title" />
    <Meta :content="meta.title" name="og:site_name" />
    <Meta :content="meta.description" name="og:description" />

    <Link rel="stylesheet"
      href="https://cdn.jsdelivr.net/npm/@mdi/font@5.8.55/css/materialdesignicons.min.css" />

    <Link href="/manifest.json" rel="manifest" />
    <Link href="/favicon.ico" rel="shortcut icon" />
    <Link href="/pwa/apple-icon-180.png" rel="apple-touch-icon" />

    <Link href="/pwa/apple-splash-2048-2732.png" media="(device-width: 1024px) and (device-height: 1366px) and
    (-webkit-device-pixel-ratio: 2) and (orientation: portrait)"
      rel="apple-touch-startup-image" />
    <Link href="/pwa/apple-splash-2732-2048.png" media="(device-width: 1024px) and (device-height: 1366px) and
    (-webkit-device-pixel-ratio: 2) and (orientation: landscape)"
      rel="apple-touch-startup-image" />
    <Link href="/pwa/apple-splash-1668-2388.png" media="(device-width: 834px) and (device-height: 1194px) and
    (-webkit-device-pixel-ratio: 2) and (orientation: portrait)"
      rel="apple-touch-startup-image" />
    <Link href="/pwa/apple-splash-2388-1668.png" media="(device-width: 834px) and (device-height: 1194px) and
    (-webkit-device-pixel-ratio: 2) and (orientation: landscape)"
      rel="apple-touch-startup-image" />
    <Link href="/pwa/apple-splash-1536-2048.png" media="(device-width: 768px) and (device-height: 1024px) and
    (-webkit-device-pixel-ratio: 2) and (orientation: portrait)"
      rel="apple-touch-startup-image" />
    <Link href="/pwa/apple-splash-2048-1536.png" media="(device-width: 768px) and (device-height: 1024px) and
    (-webkit-device-pixel-ratio: 2) and (orientation: landscape)"
      rel="apple-touch-startup-image" />
    <Link href="/pwa/apple-splash-1668-2224.png" media="(device-width: 834px) and (device-height: 1112px) and
    (-webkit-device-pixel-ratio: 2) and (orientation: portrait)"
      rel="apple-touch-startup-image" />
    <Link href="/pwa/apple-splash-2224-1668.png" media="(device-width: 834px) and (device-height: 1112px) and
    (-webkit-device-pixel-ratio: 2) and (orientation: landscape)"
      rel="apple-touch-startup-image" />
    <Link href="/pwa/apple-splash-1620-2160.png" media="(device-width: 810px) and (device-height: 1080px) and
    (-webkit-device-pixel-ratio: 2) and (orientation: portrait)"
      rel="apple-touch-startup-image" />
    <Link href="/pwa/apple-splash-2160-1620.png" media="(device-width: 810px) and (device-height: 1080px) and
    (-webkit-device-pixel-ratio: 2) and (orientation: landscape)"
      rel="apple-touch-startup-image" />
    <Link href="/pwa/apple-splash-1284-2778.png" media="(device-width: 428px) and (device-height: 926px) and
    (-webkit-device-pixel-ratio: 3) and (orientation: portrait)"
      rel="apple-touch-startup-image" />
    <Link href="/pwa/apple-splash-2778-1284.png" media="(device-width: 428px) and (device-height: 926px) and
    (-webkit-device-pixel-ratio: 3) and (orientation: landscape)"
      rel="apple-touch-startup-image" />
    <Link href="/pwa/apple-splash-1170-2532.png" media="(device-width: 390px) and (device-height: 844px) and
    (-webkit-device-pixel-ratio: 3) and (orientation: portrait)"
      rel="apple-touch-startup-image" />
    <Link href="/pwa/apple-splash-2532-1170.png" media="(device-width: 390px) and (device-height: 844px) and
    (-webkit-device-pixel-ratio: 3) and (orientation: landscape)"
      rel="apple-touch-startup-image" />
    <Link href="/pwa/apple-splash-1125-2436.png" media="(device-width: 375px) and (device-height: 812px) and
    (-webkit-device-pixel-ratio: 3) and (orientation: portrait)"
      rel="apple-touch-startup-image" />
    <Link href="/pwa/apple-splash-2436-1125.png" media="(device-width: 375px) and (device-height: 812px) and
    (-webkit-device-pixel-ratio: 3) and (orientation: landscape)"
      rel="apple-touch-startup-image" />
    <Link href="/pwa/apple-splash-1242-2688.png" media="(device-width: 414px) and (device-height: 896px) and
    (-webkit-device-pixel-ratio: 3) and (orientation: portrait)"
      rel="apple-touch-startup-image" />
    <Link href="/pwa/apple-splash-2688-1242.png" media="(device-width: 414px) and (device-height: 896px) and
    (-webkit-device-pixel-ratio: 3) and (orientation: landscape)"
      rel="apple-touch-startup-image" />
    <Link href="/pwa/apple-splash-828-1792.png" media="(device-width: 414px) and (device-height: 896px) and
    (-webkit-device-pixel-ratio: 2) and (orientation: portrait)"
      rel="apple-touch-startup-image" />
    <Link href="/pwa/apple-splash-1792-828.png" media="(device-width: 414px) and (device-height: 896px) and
    (-webkit-device-pixel-ratio: 2) and (orientation: landscape)"
      rel="apple-touch-startup-image" />
    <Link href="/pwa/apple-splash-1242-2208.png" media="(device-width: 414px) and (device-height: 736px) and
    (-webkit-device-pixel-ratio: 3) and (orientation: portrait)"
      rel="apple-touch-startup-image" />
    <Link href="/pwa/apple-splash-2208-1242.png" media="(device-width: 414px) and (device-height: 736px) and
    (-webkit-device-pixel-ratio: 3) and (orientation: landscape)"
      rel="apple-touch-startup-image" />
    <Link href="/pwa/apple-splash-750-1334.png" media="(device-width: 375px) and (device-height: 667px) and
    (-webkit-device-pixel-ratio: 2) and (orientation: portrait)"
      rel="apple-touch-startup-image" />
    <Link href="/pwa/apple-splash-1334-750.png" media="(device-width: 375px) and (device-height: 667px) and
    (-webkit-device-pixel-ratio: 2) and (orientation: landscape)"
      rel="apple-touch-startup-image" />
    <Link href="/pwa/apple-splash-640-1136.png" media="(device-width: 320px) and (device-height: 568px) and
    (-webkit-device-pixel-ratio: 2) and (orientation: portrait)"
      rel="apple-touch-startup-image" />
    <Link href="/pwa/apple-splash-1136-640.png" media="(device-width: 320px) and (device-height: 568px) and
    (-webkit-device-pixel-ratio: 2) and (orientation: landscape)"
      rel="apple-touch-startup-image" />
  </Head>

  <main>
    <NuxtLoadingIndicator />

    <header>
      <OSidebar open position="static" fullheight mobile="reduced"
        variant="primary">
        <NuxtLink class="Sidebar__header" to="/">
          <img class="Sidebar__logo" src="/icon-reverse.png" alt="logo" />
        </NuxtLink>

        <nav class="Sidebar__nav">
          <NuxtLink class="Sidebar__navItem"
            v-for="{ name, path } in router.options.routes.filter(({ name }) => name !== 'index')"
            :to="path">

            {{ name }}
          </NuxtLink>
        </nav>
      </OSidebar>
    </header>

    <NuxtPage />
  </main>
</template>
