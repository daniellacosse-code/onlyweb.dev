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
    <router-view />
  </div>
</template>

<script>
import Vue from "vue";
import { routes } from "@/router";
import { Navbar } from "buefy";

Vue.use(Navbar);

export default {
  components: {
    Navbar
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
@import "~bulma";

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
