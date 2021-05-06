import path from "path";
import fs from "fs";

const productionConfig = {
  buildDir: ".artifacts/nuxt",
  buildModules: [
    "@nuxtjs/dotenv",
    "@aceforth/nuxt-optimized-images",
    "@nuxtjs/pwa"
  ],
  plugins: [{ src: "@/plugins/mapbox", mode: "client" }],
  optimizedImages: {
    optimizedImages: true
  },
  pwa: {
    meta: {
      theme_color: "#42b983"
    }
  },
  env: {
    ...process.env
  }
};

const developmentConfig = () => ({
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
});

export default process.env.VERCEL ? productionConfig : developmentConfig();
