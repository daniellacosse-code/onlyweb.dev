<template>
  <article>
    <section>
      <h1><img src="/icon.png" alt="icon" /> only web</h1>

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
    </section>

    <section>
      <h2>Source Code</h2>
      <a
        href="https://github.com/daniellacosse/only-web"
        target="_blank"
        rel="noopener"
      >
        <pre>daniellacosse/only-web</pre>
      </a>
      <br />
      <a href="https://daniellacos.se"> about the author </a>
    </section>

    <section>
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
    </section>

    <section>
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
    </section>
  </article>
</template>

<style scoped>
article,
section,
h1,
p,
h2,
pre,
li {
  display: block;
}

img {
  height: var(--size-touch-target);
}

article {
  padding: var(--size-default);
  max-width: var(--device-width-tablet);
  display: block;
  margin: auto;
}

section {
  margin-bottom: var(--size-default);
}

p,
a,
h1,
h2 {
  font-family: var(--font-default);
}

h1 {
  display: flex;
  gap: var(--size-small);
  align-items: center;
  margin-top: var(--size-large);
  color: var(--color-default);
  font-size: var(--size-extra-large);
  font-weight: bold;
  margin-bottom: var(--size-default);
}

p,
h2 {
  color: var(--color-text);
}

h2 {
  font-size: var(--size-large);
  line-height: var(--size-large);
  margin-bottom: var(--size-small);
}

pre {
  font-family: var(--font-monospace);
  padding: var(--size-default);
  color: inherit;
  cursor: inherit;
  background: var(--color-highlight);
  border-radius: var(--size-small);
}

a {
  color: var(--color-default);
  text-decoration: underline;
  cursor: pointer;
}

ul {
  all: initial;
}

p,
a {
  font-size: var(--size-default);
}
</style>
