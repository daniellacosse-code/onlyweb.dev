// https://v3.nuxtjs.org/api/configuration/nuxt.config
export default defineNuxtConfig({
  plugins: [{ src: "~/plugins/oruga.js" }],
  postcss: {
    plugins: {
      "postcss-initial": {},
      "postcss-autoreset": {},
    },
  },
});
