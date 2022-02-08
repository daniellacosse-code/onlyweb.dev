<template>
  <div class="Container">
    <img class="Logo" src="~/static/icon.png?webp" alt="logo" height="128" />

    <h1>only web</h1>

    <p>
      A demo showcasing the power of only developing on web.
      <a
        href="https://www.howtogeek.com/196087/how-to-add-websites-to-the-home-screen-on-any-smartphone-or-tablet/"
        target="_blank"
        rel="noopener"
      >
        [ How to natively install this app on your device. ]
      </a>
    </p>

    <hr />

    <h2>Source Code</h2>
    <a href="https://github.com/daniellacosse/only-web">
      <pre>daniellacosse/only-web</pre>
    </a>

    <h2>Vue Ecosystem</h2>
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

    <h2>Additional Docs</h2>
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
  </div>
</template>

<script>
export default {
  name: "Index"
};
</script>

<style scoped>
.Container {
  box-sizing: border-box;
  margin-bottom: var(--gutter-huge);
  padding: var(--gutter-medium);
}
.Logo {
  display: inline-block;
  height: var(--app-icon-size);
  margin-top: var(--gutter-large);
  width: var(--app-icon-size);
}
h1 {
  color: var(--primary-color);
  font-size: 40px;
  font-weight: bold;
  line-height: 1;
  margin: var(--gutter-small) 0;
}
h1,
p {
  margin-bottom: var(--gutter-large);
}
h2 {
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
