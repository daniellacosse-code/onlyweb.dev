// https://v3.nuxtjs.org/api/configuration/nuxt.config
export default defineNuxtConfig({
  plugins: [
    {
      src: "~/plugins/oruga.js"
    }
  ],
  postcss: {
    plugins: {
      "postcss-autoreset": {},
      "postcss-initial": {}
    }
  },
  router: {
    base: process.env.VERCEL_ENV === "production" ? "/only/" : "/"
  },
  runtimeConfig: {
    public: {
      BITS_PER_BYTE: 8,
      MILLISECONDS_PER_SECOND: 1000,
      SECONDS_PER_MINUTE: 60,
      geolocation: {
        locationSearchTimeout: 3000,
        mapboxStyle: "mapbox://styles/mapbox/streets-v11",
        mapboxToken: process.env.NUXT_ENV_MAPBOX_TOKEN,
        zoomLevelDefault: 3,
        zoomLevelSpecific: 12
      },
      meta: {
        color: "hsl(153, 47%, 49%)",
        description: "the case for only web",
        title: "only web"
      },
      sidebar: {
        navIconMap: {
          default: "file-document-outline",
          "3D": "cube",
          geolocation: "map-marker",
          music: "music",
          rust: "gamepad-circle-right",
          scanner: "qrcode-scan"
        }
      },
      music: {
        playerBeatsPerMinuteDefault: 100,
        playerChordInstructionsDefault: "I V vi V7/IV IV I ii V7 Isus4 Isus2 I",
        playerNoteReadoutDefault: ["--"]
      },
      rust: {
        colorBackground: "#FFFFFF",
        colorDefault: "#000000",
        sizeCell: 10
      },
      scanner: {
        decoderReaders: ["upc_reader", "upc_e_reader", "qrcode"],
        readoutTextDefault: "--"
      },
      threeDimensional: {
        colorBackground: [0.1, 0.1, 0.1],
        positionCamera: [-1, 0, 6],
        rotationLight: [45, 0, 0],
        rotationSpeedCube: [10, 20, 30]
      }
    }
  }
});
