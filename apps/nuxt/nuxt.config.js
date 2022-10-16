// https://v3.nuxtjs.org/api/configuration/nuxt.config
export default defineNuxtConfig({
  plugins: [{ src: "~/plugins/oruga.js" }],
  postcss: {
    plugins: {
      "postcss-initial": {},
      "postcss-autoreset": {},
    },
  },
  runtimeConfig: {
    public: {
      BITS_PER_BYTE: 8,
      MILLISECONDS_PER_SECOND: 1000,
      SECONDS_PER_MINUTE: 60,
      geolocation: {
        mapboxToken: process.env.NUXT_ENV_MAPBOX_TOKEN,
        mapboxStyle: "mapbox://styles/mapbox/streets-v11",
        zoomLevelDefault: 3,
        zoomLevelSpecific: 12,
        locationSearchTimeout: 3000,
      },
      threeDimensional: {
        colorBackground: [0.1, 0.1, 0.1],
        positionCamera: [0, 0, 6],
        rotationLight: [45, 0, 0],
        rotationSpeedCube: [10, 20, 30],
      },
      scanner: {
        readoutTextDefault: "--",
        decoderReaders: ["upc_reader", "upc_e_reader"],
      },
      music: {
        playerChordInstructionsDefault: "I V vi V7/IV IV I ii V7 Isus4 Isus2 I",
        playerNoteReadoutDefault: ["--"],
        playerBeatsPerMinuteDefault: 100,
      },
      rust: {
        sizeCell: 10,
        colorDefault: "#000000",
        colorBackground: "#FFFFFF",
      },
    },
  },
});
