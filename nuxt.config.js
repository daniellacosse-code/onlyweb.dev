import path from "path";
import fs from "fs";

const productionConfig = {
  buildDir: ".artifacts/nuxt",
  buildModules: ["@nuxtjs/dotenv", "@nuxtjs/pwa"],
  plugins: [
    {
      mode: "client",
      src: "@/plugins/mapbox"
    }
  ],
  pwa: {
    icon: {
      fileName: "apple-touch-icon.png"
    },
    meta: {
      name: "only web",
      theme_color: "#42b983",
      appleStatusBarStyle: "black-translucent",
      nativeUI: true
    },
    manifest: {
      name: "only web",
      short_name: "only"
    }
  },
  router: {
    base: "/only/"
  }
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
