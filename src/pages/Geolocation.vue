<template>
  <mapbox-map
    style="height: 100vh; width: 100vw"
    :access-token="accessToken"
    :map-style="style"
    :center="center"
    :zoom="zoom"
    @mb-created="init"
  />
</template>

<script>
import { MapboxMap } from "@studiometa/vue-mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";

const DEFAULT_ZOOM = 3;
const SPECIFIC_ZOOM = 12;

export default {
  components: { MapboxMap },
  data: function() {
    return {
      accessToken: process.env.MAPBOX_TOKEN,
      map: null,
      style: "mapbox://styles/mapbox/light-v9",
      center: [0, 0],
      zoom: DEFAULT_ZOOM
    };
  },
  methods: {
    init(mapboxInstance) {
      this.map = mapboxInstance;

      navigator.geolocation.getCurrentPosition(
        ({ coords: { latitude, longitude } }) => {
          this.$root.loading = false;
          this.center = [longitude, latitude];
          this.zoom = SPECIFIC_ZOOM;
        },
        () => (this.$root.loading = false)
      );
    }
  }
};
</script>
