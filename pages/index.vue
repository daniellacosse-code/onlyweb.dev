<template>
  <div class="hello">
    <img class="Logo" src="~/static/icon.png?webp" alt="logo" height="128" />

    <h1>only web</h1>
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

    <img
      class="Diagram"
      src="~/static/architecture.png?webp"
      alt="architecture"
      height="444"
    />
    <figcaption>
      Source:
      <a href="https://github.com/daniellacosse/only-web">
        <pre>daniellacosse/only-web</pre>
      </a>
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

    <h3>Vue Ecosystem</h3>
    <ul>
      <li>
        <a href="https://nuxtjs.org/" target="_blank" rel="noopener">nuxt</a>
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
  name: "HelloWorld"
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
  height: 128px;
  margin-top: 50px;
  display: inline-block;
}
.Diagram {
  max-width: 650px;
  width: 100%;
  margin-top: 50px;
  aspect-ratio: 1.46;
  display: inline-block;
}
h1 {
  font-size: 40px;
  margin: 10px 0;
  color: #42b983;
  font-weight: bold;
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
  font-weight: bold;
}
</style>
