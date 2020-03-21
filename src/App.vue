<template>
  <div id="app">
    <b-navbar>
      <template slot="start">
        <b-navbar-item
          v-for="route in routes"
          :to="route.path"
          tag="router-link"
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

#nav {
  padding: 30px;

  a {
    font-weight: bold;
    color: #2c3e50;

    &.router-link-exact-active {
      color: #42b983;
    }
  }
}
</style>
