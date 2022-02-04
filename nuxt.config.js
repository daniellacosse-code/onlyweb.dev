import path from "path";
import fs from "fs";

import head from "./plugins/head";

const baseConfig = {
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
  head
};

const developmentConfig = () => ({
  ...baseConfig,
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

// ISSUE: #50 dependencies: nuxt3, vue3, vite, and the old insecure packages
export default process.env.VERCEL ? baseConfig : developmentConfig();
