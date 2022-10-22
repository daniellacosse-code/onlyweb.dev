<script setup>
import "mapbox-gl/dist/mapbox-gl.css";
import mapboxgl from "mapbox-gl";

const { public: { geolocation } } = useRuntimeConfig();

mapboxgl.accessToken = geolocation.mapboxToken;

let center = [0, 0];
let zoom = geolocation.zoomLevelDefault;

const map = ref(null);

watch(() => center, () => map.value.setCenter(center));
watch(() => zoom, () => map.value.setZoom(zoom));

onMounted(() => {
  map.value = new mapboxgl.Map({
    center,
    container: "Mapbox",
    style: geolocation.mapboxStyle,
    zoom
  });

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
});
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
