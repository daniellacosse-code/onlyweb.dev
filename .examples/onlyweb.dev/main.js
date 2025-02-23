import { start } from "jsr:@lonly/web";

import { MainPage } from "./pages/main.js";
// import { GalleryPage } from "./pages/__gallery__.js";
// import { MusicDemoPage } from "./pages/demos/music.js";

start({
  MainPage,
  // GalleryPage,
  // MusicDemoPage,
  "/robots.txt": "./files/robots.txt",
  "/favicon.ico": "./files/images/logo/maskable.png",
  "/manifest.json": "./files/manifest.json",
  "/images": "./files/images",
});
