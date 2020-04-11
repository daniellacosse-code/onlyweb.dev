<template>
  <div class="hello">
    <h1>A modern native web demo, written in Vue.js</h1>

    <h3>
      <a
        href="https://www.howtogeek.com/196087/how-to-add-websites-to-the-home-screen-on-any-smartphone-or-tablet/"
        target="_blank"
        rel="noopener"
        >[ Go here ]</a
      >
      for a guide on how to install this app on your device.
    </h3>

    <img src="/img/architecture.png" alt="architecture" />

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
  props: {
    msg: String
  }
};
</script>

<style scoped>
.hello {
  box-sizing: border-box;
  padding: 15px;
}
img {
  max-width: 650px;
  width: 100%;
}
h1 {
  font-size: 40px;
  margin-bottom: 20px;
}
h3 {
  margin: 40px 0 30px;
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
