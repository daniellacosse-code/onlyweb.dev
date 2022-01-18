import path from "path";
import fs from "fs";

import pwa from "./pwa";

const productionConfig = {
  buildDir: ".artifacts/nuxt",
  buildModules: ["@nuxtjs/dotenv", "@aceforth/nuxt-optimized-images"],
  plugins: [
    {
      mode: "client",
      src: "@/plugins/mapbox"
    }
  ],
  router: {
    base: "/only/"
  },
  head: { ...pwa }
};

const developmentConfig = () => ({
  ...productionConfig,
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
});

export default process.env.VERCEL ? productionConfig : developmentConfig();
