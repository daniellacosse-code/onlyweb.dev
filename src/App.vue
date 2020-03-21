<template>
  <main>
    <b-tabs v-model="activeTab" :animated="false" destroy-on-hide>
      <b-tab-item label="Hello, World!">
        <HelloWorld msg="Welcome to Your Vue.js App" />
      </b-tab-item>
      <b-tab-item label="Other tab.">
        Nothing to see here.
      </b-tab-item>
    </b-tabs>
  </main>
</template>

<script>
import Vue from "vue";
import VueRouter from "vue-router";
import { Tabs } from "buefy";
import * as pages from "./pages";

Vue.use(Tabs);

export default Vue.extend({
  name: "App",
  data: function() {
    return {
      activeTab: 0
    };
  },
  components: {
    HelloWorld
  }
});
</script>

<style lang="scss">
@import "~bulma";
@import "~buefy/src/scss/components/_tabs";

html,
body,
main {
  width: 100vw;
  height: 100vh;
  font-family: HelveticaNeue, Helvetica, sans-serif;
}
</style>
