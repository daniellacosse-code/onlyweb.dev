<style>
/* app frame + vars */
body,
main {
  position: relative;
  display: block;
  width: 100vw;
  height: 100vh;

  --color-default: v-bind(meta.color);
  --color-danger: rgb(199, 77, 77);
  --color-text: hsl(280deg, 0%, 10%);
  --color-background: hsl(156, 42%, 95%);
  --color-highlight: hsl(0, 0%, 100%);

  --font-default: "HelveticaNeue", Helvetica, Arial, sans-serif;
  --font-monospace: "Menlo", monospace;

  --size-extra-small: 0.25rem;
  --size-small: 0.5rem;
  --size-default: 1rem;

  --size-font-default-offset: -0.35rem;

  --size-medium: 1.5rem;
  --size-large: 2rem;
  --size-extra-large: 3rem;
  --size-huge: 6rem;

  --size-touch-target: var(--size-extra-large);

  --device-width-mobile: 320px;
  --device-width-tablet: 1020px;
}

body {
  background-color: hsl(153, 47%, 49%);
}

main {
  background-color: white;
}

/* faux component library */
label {
  font-family: var(--font-default);
  font-size: var(--size-default);
  display: flex;
  flex-direction: column;
  font-weight: bold;
  margin-bottom: var(--size-default);
}

label>input,
label>textarea {
  font-family: var(--font-default);
  font-size: var(--size-default);
  margin-top: var(--size-small);
  border: var(--size-extra-small) solid var(--color-text);
  display: block;
  box-sizing: border-box;
  border-radius: var(--size-extra-small);
  padding: var(--size-small);
}

label>input:focus,
label>textarea:focus {
  border-color: var(--color-default);
}

label>textarea {
  font-family: var(--font-monospace);
}

button {
  font-family: var(--font-default);
  font-size: var(--size-default);
  font-weight: bold;
  text-transform: uppercase;
  background: var(--color-default);
  padding: var(--size-small) var(--size-default);
  border-radius: var(--size-extra-small);
  color: var(--color-background);
  cursor: pointer;
  margin-top: var(--size-font-default-offset);
}

button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

/* Navbar styles */
.Navbar {
  display: flex;
  justify-content: space-between;
  background: var(--color-default);
  padding: var(--size-default);
  position: sticky;
  top: 0;
}

.Navbar__home {
  display: flex;
  align-items: center;
}

.Navbar__logo {
  height: 48px;
  cursor: pointer;
  display: inline-block;
  margin-right: var(--size-large);
}

.Navbar__nav {
  flex-grow: 1;
  display: flex;
  justify-content: space-around;
  align-items: center;
  max-width: var(--device-width-tablet);
}

.Navbar__navItem {
  cursor: pointer;
  overflow: hidden;
  text-overflow: ellipsis;
  display: inline-flex;
  align-items: center;
  gap: var(--size-small);
  min-width: var(--size-touch-target);
  min-height: var(--size-touch-target);
}

.Navbar__navItemIcon {
  cursor: pointer;
  color: var(--color-background);
  font-size: var(--size-medium);
  user-select: none;
}

.Navbar__navItemText {
  color: var(--color-highlight);
  cursor: pointer;
  font-family: var(--font-default);
  font-size: var(--size-medium);
  font-weight: bold;
  margin-top: var(--size-font-default-offset);
  user-select: none;
}

.Navbar__navItemText:hover,
.Navbar__navItemText--active {
  text-decoration: underline;
}

@media (max-width: 1020px) {
  .Navbar__navItemText {
    display: none;
  }
}
</style>

<script setup>
const { public: { meta, navbar } } = useRuntimeConfig();
const router = useRouter();
const activeRoute = useRoute();

let { title, description } = meta;

if (activeRoute.path !== "/") {
  title = `${title} | ${activeRoute.name}`;
  description = `${description} (${activeRoute.name} demo)`;
}

// ISSUE #81: redo service worker
</script>

<template>

  <Head>
    <Title>{{ title }}</Title>

    <!-- <Base v-if="environment === 'production'" -->
    <!-- href="https://only.daniellacos.se/" /> -->

    <Meta charset="utf-8" />
    <Meta content="width=device-width,initial-scale=1,minimal-ui"
      name="viewport" />

    <Meta content="yes" name="mobile-web-app-capable" />
    <Meta content="yes" name="apple-mobile-web-app-capable" />
    <Meta content="black-translucent"
      name="apple-mobile-web-app-status-bar-style" />

    <Meta :content="title" name="apple-mobile-web-app-title" />
    <Meta :content="title" name="og:title" />
    <Meta :content="title" name="og:site_name" />
    <Meta content="website" name="og:type" />

    <Meta :content="description" name="description" />
    <Meta :content="description" name="og:description" />

    <Meta :content="meta.color" name="theme-color" />

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

    <header class="Navbar">
      <NuxtLink class="Navbar__home" to="/">
        <img class="Navbar__logo" src="/icon-reverse.png" alt="logo" />
      </NuxtLink>

      <nav class="Navbar__nav">
        <NuxtLink class="Navbar__navItem"
          v-for="{ name, path } in router.getRoutes().filter(({ name }) => name !== 'index')"
          :to="path">
          <span class="Navbar__navItemIcon">
            {{ navbar.navIconMap[name] ?? navbar.navIconMap.default }}
          </span>
          <span
            :class="{ 'Navbar__navItemText': true, 'Navbar__navItemText--active': path === activeRoute.path }">{{
    name
            }}</span>
        </NuxtLink>
      </nav>
    </header>

    <NuxtPage />
  </main>
</template>
