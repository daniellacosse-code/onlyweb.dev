<template>
  <div id="map"></div>
</template>

<script>
import "mapbox-gl/dist/mapbox-gl.css";
import mapboxgl from "mapbox-gl";

mapboxgl.accessToken = process.env.NUXT_ENV_MAPBOX_TOKEN;

export default {
  mounted() {
    this.map = new mapboxgl.Map({
      center: this.center,
      container: "map",
      style: "mapbox://styles/mapbox/streets-v11",
      zoom: this.zoom
    });
  },
  props: {
    center: {
      default: () => [0, 0],
      type: Array
    },
    zoom: {
      default: 3,
      type: Number
    }
  },
  watch: {
    center: function (value) {
      this.map.setCenter(value);
    },
    zoom: function (value) {
      this.map.setZoom(value);
    }
  }
};
</script>

<style scoped>
#map {
  height: 100%;
  width: 100%;
}
</style>
