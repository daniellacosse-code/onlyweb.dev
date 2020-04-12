<template>
  <div class="hello">
    <img class="Logo" src="/demo/img/icons/icon.png" alt="logo" />

    <h1>Only Web</h1>
    <h2>A modern native web demo, written in Vue.js</h2>

    <h3>
      <a
        href="https://www.howtogeek.com/196087/how-to-add-websites-to-the-home-screen-on-any-smartphone-or-tablet/"
        target="_blank"
        rel="noopener"
        >[ Go here ]</a
      >
      for a guide on how to install this app on your device.
    </h3>

    <img class="Diagram" src="/demo/img/architecture.png" alt="architecture" />
    <figcaption>
      Source:
      <a href="https://github.com/daniellacosse/only-web"
        ><pre>daniellacosse/only-web</pre></a
      >
    </figcaption>

    <h3>Essential Docs</h3>
    <ul>
      <li>
        <a href="https://vuejs.org" target="_blank" rel="noopener">Vue</a>
      </li>
      <li>
        <a href="https://www.rust-lang.org/learn" target="_blank" rel="noopener"
          >Rust</a
        >
      </li>
      <li>
        <a href="https://docs.mapbox.com/" target="_blank" rel="noopener"
          >Mapbox</a
        >
      </li>
      <li>
        <a
          href="https://developer.playcanvas.com/en/api/"
          target="_blank"
          rel="noopener"
          >PlayCanvas</a
        >
      </li>
    </ul>
    <h3>Installed Vue CLI Plugins</h3>
    <ul>
      <li>
        <a
          href="https://github.com/vuejs/vue-cli/tree/dev/packages/%40vue/cli-plugin-babel"
          target="_blank"
          rel="noopener"
          >babel</a
        >
      </li>
      <li>
        <a
          href="https://github.com/vuejs/vue-cli/tree/dev/packages/%40vue/cli-plugin-router"
          target="_blank"
          rel="noopener"
          >router</a
        >
      </li>
      <li>
        <a
          href="https://github.com/raphaelcockx/vue-cli-plugin-meta"
          target="_blank"
          rel="noopener"
          >meta</a
        >
      </li>
      <li>
        <a
          href="https://github.com/vuejs/vue-cli/tree/dev/packages/%40vue/cli-plugin-pwa"
          target="_blank"
          rel="noopener"
          >pwa</a
        >
      </li>
    </ul>

    <h3>Vue Ecosystem</h3>
    <ul>
      <li>
        <a href="https://router.vuejs.org" target="_blank" rel="noopener"
          >vue-router</a
        >
      </li>
      <li>
        <a href="https://vuex.vuejs.org" target="_blank" rel="noopener">vuex</a>
      </li>
      <li>
        <a
          href="https://github.com/vuejs/vue-devtools#vue-devtools"
          target="_blank"
          rel="noopener"
          >vue-devtools</a
        >
      </li>
      <li>
        <a href="https://vue-loader.vuejs.org" target="_blank" rel="noopener"
          >vue-loader</a
        >
      </li>
      <li>
        <a
          href="https://github.com/vuejs/awesome-vue"
          target="_blank"
          rel="noopener"
          >awesome-vue</a
        >
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  name: "HelloWorld",
  mounted() {
    this.$root.loading = false;
  }
};
</script>

<style scoped>
.hello {
  box-sizing: border-box;
  padding: 15px;
  margin-bottom: 100px;
}
.Logo {
  width: 128px;
  margin-top: 50px;
}
.Diagram {
  max-width: 650px;
  width: 100%;
  margin-top: 50px;
}
h1 {
  font-size: 40px;
  margin: 10px 0;
  color: #42b983;
}
h2 {
  font-size: 25px;
  color: #2c3e50;
  margin-bottom: 70px;
}
h3,
figcaption {
  margin: 30px 0 15px 0;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}
</style>
