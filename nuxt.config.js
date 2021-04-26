import path from "path";
import fs from "fs";

const productionConfig = {
  buildDir: ".artifacts/nuxt",
  buildModules: ["@nuxtjs/dotenv", "@nuxtjs/pwa"],
  plugins: [
    { src: "@/plugins/mapbox", mode: "client" }
    // { src: "@/plugins/conway/pkg" }
  ]
};

const developmentConfig = {
  ...productionConfig,
  router: {
    base: "/only/"
  },
  server: {
    port: 8080,
    https: {
      key: fs.readFileSync(
        path.resolve(__dirname, ".artifacts/mkcert/local.key")
      ),
      cert: fs.readFileSync(
        path.resolve(__dirname, ".artifacts/mkcert/local.crt")
      )
    }
  }
};

export default process.env.NODE_ENV === "production"
  ? productionConfig
  : developmentConfig;
