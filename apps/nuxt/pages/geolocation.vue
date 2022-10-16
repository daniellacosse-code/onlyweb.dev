<script setup>
import "mapbox-gl/dist/mapbox-gl.css";
import mapboxgl from "mapbox-gl";

const { public: { geolocation } } = useRuntimeConfig();

mapboxgl.accessToken = geolocation.mapboxToken;

let center = [0, 0];
let zoom = geolocation.zoomLevelDefault;
const map = new mapboxgl.Map({
  center,
  container: "Mapbox",
  style: geolocation.mapboxStyle,
  zoom
});

watch(() => center, () => map.setCenter(center));
watch(() => zoom, () => map.setZoom(zoom));

navigator.geolocation.getCurrentPosition(
  ({ coords: { latitude, longitude } }) => {
    center = [longitude, latitude];
    zoom = geolocation.zoomLevelSpecific;
  },
  (error) => alert(error.message),
  {
    timeout: geolocation.locationSearchTimeout
  }
);
</script>

<template>
  <div id="Mapbox"></div>
</template>

<style scoped>
#Mapbox {
  height: 100%;
  width: 100%;
}
</style>
