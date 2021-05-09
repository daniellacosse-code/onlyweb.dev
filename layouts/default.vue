<template>
  <div id="app">
    <b-navbar class="Navbar" type="is-primary">
      <template slot="brand">
        <b-navbar-item tag="nuxt-link" :to="{ path: '/' }">
          <img src="/img/icons/reverse-icon.png" alt="logo" />
        </b-navbar-item>
      </template>
      <template slot="start">
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
  </div>
</template>

<script>
import Vue from "vue";
import { Navbar } from "buefy";

Vue.use(Navbar);

export default {
  components: {
    Navbar
  },
  computed: {
    routes() {
      return this.$router.options.routes
        .filter(({ name }) => name !== "index")
        .map(route => ({
          ...route,
          name: route.name[0].toUpperCase() + route.name.slice(1)
        }));
    }
  },
  methods: {
    isActive(path) {
      return path === this.$route.path;
    }
  }
};
</script>

<style lang="scss">
@import "~bulma/sass/utilities/_all";

$primary: #42b983;
$primary-invert: findColorInvert($primary);
$twitter: #4099ff;
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
  background-color: $primary;
}

#app {
  font-family: "HelveticaNeue", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  background-color: $white;
  width: 100vw;
  height: 100vh;
  overflow: hidden;
  overflow-y: scroll;
}

.Navbar {
  width: 100vw;
}

#app .Disabled {
  color: $danger;
  cursor: not-allowed;
}
</style>
