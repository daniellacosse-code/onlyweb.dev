<script setup>
import "mapbox-gl/dist/mapbox-gl.css";
import mapboxgl from "mapbox-gl";

const { public: { geolocation } } = useRuntimeConfig();

const map = ref(null);
mapboxgl.accessToken = geolocation.mapboxToken;

onMounted(async () => {
  await nextTick();

  map.value = new mapboxgl.Map({
    center: [0, 0],
    container: "Mapbox",
    style: geolocation.mapboxStyle,
    zoom: geolocation.zoomLevelDefault
  });

  navigator.geolocation?.getCurrentPosition(
    ({ coords: { latitude, longitude } }) => {
      map.value.setCenter([longitude, latitude]);
      map.value.setZoom(geolocation.zoomLevelSpecific);
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
