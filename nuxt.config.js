import path from "path";
import fs from "fs";

import head from "./plugins/head";

const getLocalConfig = () => ({
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

const routerConfig = {
  router: {
    base: "/only/"
  }
};

let nuxtConfig = {
  buildDir: ".artifacts/nuxt",
  buildModules: ["@nuxtjs/dotenv", "@aceforth/nuxt-optimized-images"],
  head,
  plugins: [
    {
      mode: "client",
      src: "@/plugins/mapbox"
    }
  ]
};

switch (process.env.VERCEL_ENV) {
  // including the router config breaks asset serving non-locally
  case "development":
  case "preview":
    break;

  // in production we only want to go to only via /only anyway, so we
  // care less about only.daniellacos.se being broken
  case "production":
    nuxtConfig = {
      ...nuxtConfig,
      ...routerConfig
    };
    break;

  // if no VERCEL_ENV, we're working locally
  default:
    nuxtConfig = {
      ...nuxtConfig,
      ...routerConfig,
      ...getLocalConfig()
    };
}

// ISSUE #50 - dependencies: nuxt3, vue3, vite, and the old insecure packages
export default nuxtConfig;
