<style>
:root {
  /* TODO: --color-default: v-bind(color); */
  --color-default: hsl(153, 47%, 49%);
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

  --oruga-variant-primary: var(--color-default);
}

html,
body {
  width: 100vw;
  height: 100vh;
}

main {
  display: flex;
}

/* lmao this is wacky */
main,
#__nuxt,
header,
.o-side {
  height: 100%;
}

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
// if ("serviceWorker" in navigator) {
//   try {
//     const registration = await navigator.serviceWorker.register("~static/sw.js");
//     consola.success(
//       "Registration successful, scope is:",
//       registration.scope
//     );
//   } catch (error) {
//     consola.error("Service worker registration failed, error:", error);
//   }
// }

const router = useRouter();

const title = "only web";
const description = "the case for only web";
const color = "hsl(153, 47%, 49%)";
</script>

<template>

  <Head>
    <Title>{{ title }}</Title>

    <Meta charset="utf-8" />
    <Meta content="width=device-width,initial-scale=1,minimal-ui"
      name="viewport" />

    <Meta content="yes" name="mobile-web-app-capable" />
    <Meta content="yes" name="apple-mobile-web-app-capable" />
    <Meta content="black-translucent"
      name="apple-mobile-web-app-status-bar-style" />
    <Meta :content="title" name="apple-mobile-web-app-title" />
    <Meta :content="description" name="description" />
    <Meta :content="color" name="theme-color" />
    <Meta content="website" name="og:type" />
    <Meta :content="title" name="og:title" />
    <Meta :content="title" name="og:site_name" />
    <Meta :content="description" name="og:description" />

    <!-- TODO: apple touch icons -->
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
