<template>
  <main>
    <b-navbar class="Navbar" type="is-primary" fixed-top>
      <template #brand>
        <b-navbar-item tag="nuxt-link" :to="{ path: '/' }">
          <img src="~/static/reverse-icon.png?webp" alt="logo" />
        </b-navbar-item>
      </template>
      <template #start>
        <b-navbar-item
          v-for="route in routes"
          :to="route.path"
          tag="router-link"
          :active="isActive(route.path)"
          :key="route.name"
          :disabled="route.disabled"
        >
          {{ route.name }}
        </b-navbar-item>

        <!-- just some todos -->
        <b-navbar-item class="Disabled"> P2P (TODO) </b-navbar-item>
        <b-navbar-item class="Disabled"> Music (TODO) </b-navbar-item>
      </template>
    </b-navbar>
    <nuxt />
  </main>
</template>

<script>
import consola from "consola";
import { Navbar } from "buefy";
import Vue from "vue";

Vue.use(Navbar);

export default {
  computed: {
    routes() {
      return this.$router.options.routes
        .filter(({ name }) => name !== "index")
        .map((route) => ({
          ...route,
          name: route.name[0].toUpperCase() + route.name.slice(1)
        }));
    }
  },
  methods: {
    isActive(path) {
      return path === this.$route.path;
    }
  },
  async mounted() {
    if ("serviceWorker" in navigator) {
      try {
        const registration = await navigator.serviceWorker.register("./sw.js");

        consola.success(
          "Registration successful, scope is:",
          registration.scope
        );
      } catch (error) {
        consola.error("Service worker registration failed, error:", error);
      }
    }
  }
};
</script>

<style lang="scss">
@import "~bulma/sass/utilities/_all";

$primary: hsl(153, 47%, 49%);
$primary-invert: findColorInvert($primary);
$twitter: hsl(212, 100%, 63%);
$twitter-invert: findColorInvert($twitter);

$colors: (
  "white": (
    $white,
    $black
  ),
  "black": (
    $black,
    $white
  ),
  "light": (
    $light,
    $light-invert
  ),
  "dark": (
    $dark,
    $dark-invert
  ),
  "primary": (
    $primary,
    $primary-invert
  ),
  "info": (
    $info,
    $info-invert
  ),
  "success": (
    $success,
    $success-invert
  ),
  "warning": (
    $warning,
    $warning-invert
  ),
  "danger": (
    $danger,
    $danger-invert
  ),
  "twitter": (
    $twitter,
    $twitter-invert
  )
);

$link: $primary;
$link-invert: $primary-invert;
$link-focus-border: $primary;

@import "~bulma";
@import "~buefy/src/scss/buefy";

:root {
  --primary-color: hsl(153, 47%, 49%);
  --text-color: hsl(210, 29%, 24%);

  --default-font: "HelveticaNeue", Helvetica, Arial, sans-serif;
  --monospace-font: "Menlo", monospace;

  --gutter-small: 0.6rem;
  --gutter-medium: 1rem;
  --gutter-large: 2rem;
  --gutter-extra-large: 3rem;
  --gutter-huge: 6rem;

  --app-icon-size: 128px;
  --mobile-device-width: 320px;
  --tablet-device-width: 680px;

  background-color: var(--primary-color);
}

html,
main {
  font-family: var(--default-font);
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: var(--text-color);
  background-color: $white;
  width: 100vw;
  height: 100vh;
  overflow-x: hidden;
  overflow-y: auto;
}

main {
  height: calc(100vh - 52px);
}

.Navbar {
  width: 100vw;
}

#app .Disabled {
  color: $danger;
  cursor: not-allowed;
}
</style>
