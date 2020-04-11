<template>
  <div id="app">
    <b-navbar class="Navbar" type="is-primary">
      <template slot="start">
        <b-navbar-item
          v-for="route in routes"
          :to="route.path"
          tag="router-link"
          :active="isActive(route.path)"
          :key="route.name"
        >
          {{ route.name }}
        </b-navbar-item>
      </template>
    </b-navbar>
    <b-loading :active.sync="$root.loading" />
    <router-view />
  </div>
</template>

<script>
import Vue from "vue";
import { routes } from "@/router";
import { Navbar, Loading } from "buefy";

Vue.use(Navbar);
Vue.use(Loading);

export default {
  components: {
    Navbar,
    Loading
  },
  methods: {
    isActive(path) {
      return (
        `${process.env.BASE_URL}${path.slice(1)}` === window.location.pathname
      );
    }
  },
  data: function() {
    return { routes };
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

html {
  background-color: $primary;
}

#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
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
</style>
