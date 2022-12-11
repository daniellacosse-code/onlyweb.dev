// https://v3.nuxtjs.org/api/configuration/nuxt.config
export default defineNuxtConfig({
  app: {
    pageTransition: false,
    layoutTransition: false
  },
  plugins: ["~/plugins/quagga.js"],
  postcss: {
    plugins: {
      "postcss-autoreset": {},
      "postcss-initial": {}
    }
  },
  runtimeConfig: {
    public: {
      environment: process.env.VERCEL_ENV ?? process.env.NODE_ENV,
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
      navbar: {
        navIconMap: {
          default: "📄",
          "3D": "📦",
          geolocation: "🗺",
          music: "🎵",
          rust: "🦀",
          scanner: "🤳🏻"
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
        readoutTextDefault: "[scan data will show here]"
      },
      threeDimensional: {
        colorBackground: { luminance: 0.2 },
        positionCamera: { z: 6 },
        rotationLight: { x: 45 },
        rotationSpeedCube: 100
      }
    }
  }
});
