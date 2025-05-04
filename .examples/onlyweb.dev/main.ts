import { start } from "@onlyweb/backend";

import * as constants from "./constants.ts";

import "./pages/favicon.ts";
import "./pages/robots.ts";
import "./pages/main.ts";
import "./pages/__gallery__.ts";

// demos
import "./pages/demos/music.ts";

Deno.env.set(
  "OWF_ALLOW_DOMAINS",
  `${
    new URL(constants.KEYCDN_IMAGE_ZONE_URL).hostname
  } d07riv.github.io toji.github.io cdn.skypack.dev`,
);

start();
