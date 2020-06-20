import path from "path";
import fs from "fs";

export default {
  router: {
    base: "/only/",
  },
  server: {
    https: {
      key: fs.readFileSync(path.resolve(__dirname, ".ssl/local.key")),
      cert: fs.readFileSync(path.resolve(__dirname, ".ssl/local.crt")),
    },
  },
};
