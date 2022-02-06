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
      >
        [ Go here ]
      </a>
      for a guide on how to install this app on your device.
    </h3>

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
        <a
          href="https://www.rust-lang.org/learn"
          target="_blank"
          rel="noopener"
        >
          Rust
        </a>
      </li>
      <li>
        <a href="https://docs.mapbox.com/" target="_blank" rel="noopener">
          Mapbox
        </a>
      </li>
      <li>
        <a
          href="https://developer.playcanvas.com/en/api/"
          target="_blank"
          rel="noopener"
        >
          PlayCanvas
        </a>
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
        >
          vue-devtools
        </a>
      </li>
      <li>
        <a
          href="https://github.com/vuejs/awesome-vue"
          target="_blank"
          rel="noopener"
        >
          awesome-vue
        </a>
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
  margin-bottom: var(--gutter-huge);
  padding: var(--gutter-medium);
}
.Logo {
  display: inline-block;
  height: var(--app-icon-size);
  margin-top: var(--gutter-extra-large);
  width: var(--app-icon-size);
}
h1 {
  color: var(--primary-color);
  font-size: 40px;
  font-weight: bold;
  margin: var(--gutter-small) 0;
}
h2 {
  color: var(--text-color);
  font-size: 25px;
  margin-bottom: var(--gutter-extra-large);
}
h3,
figcaption {
  margin: var(--gutter-large) 0 var(--gutter-medium) 0;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 var(--gutter-small);
}
a {
  color: var(--primary-color);
  font-weight: bold;
}
</style>
