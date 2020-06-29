import path from "path";
import fs from "fs";

export default {
  buildDir: ".artifacts/nuxt",
  buildModules: ["@nuxtjs/dotenv"],
  router: {
    base: "/only/",
  },
  server: {
    port: 8080,
    host: "local.daniellacos.se",
    https: {
      key: fs.readFileSync(path.resolve(__dirname, ".artifacts/ssl/local.key")),
      cert: fs.readFileSync(
        path.resolve(__dirname, ".artifacts/ssl/local.crt")
      ),
    },
  },
};
