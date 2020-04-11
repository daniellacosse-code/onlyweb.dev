<template>
  <div id="app">
    <b-navbar fixed-top>
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
    isActive([slash, ...path]) {
      return (
        `${process.env.BASE_URL}${path.join("")}` === window.location.pathname
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

#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}
</style>
