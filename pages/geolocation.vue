<template>
  <client-only>
    <Map :center="center" :zoom="zoom" />
  </client-only>
</template>

<script>
import Map from "@/components/Map.vue";

const SPECIFIC_ZOOM = 12;

export default {
  components: {
    Map
  },
  data: function () {
    return {
      center: [0, 0],
      zoom: 3
    };
  },
  mounted() {
    navigator.geolocation.getCurrentPosition(
      ({ coords: { latitude, longitude } }) => {
        this.center = [longitude, latitude];
        this.zoom = SPECIFIC_ZOOM;
      },
      (error) => alert(error.message),
      {
        timeout: 3000
      }
    );
  }
};
</script>
