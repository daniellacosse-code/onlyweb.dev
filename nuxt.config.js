import path from "path";
import fs from "fs";

export default {
  buildDir: ".artifacts/nuxt",
  buildModules: ["@nuxtjs/dotenv", "@nuxtjs/pwa"],
  plugins: [
    { src: "@/plugins/mapbox", mode: "client" },
    { src: "@/plugins/conway/pkg" },
  ],
  router: {
    base: "/only/",
  },
  server: {
    port: 8080,
    https: {
      key: fs.readFileSync(path.resolve(__dirname, ".artifacts/ssl/local.key")),
      cert: fs.readFileSync(
        path.resolve(__dirname, ".artifacts/ssl/local.crt")
      ),
    },
  },
};
