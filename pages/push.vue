<script>
import Vue from "vue";
import { Button } from "buefy";

Vue.use(Button);

export default {
  components: {
    Button,
  },
  name: "Push",
  methods: {
    async notify(message) {
      const permission = await Notification.requestPermission();

      switch (permission) {
        case "granted":
          new Notification(message, { body: "Sent from Only Web." });
          break;
        case "denied":
        default:
          alert(message);
      }
    },
  },
};
</script>

<template>
  <section class="Push">
    <b-button @click="notify('This is a basic notification!')">
      Send basic notification
    </b-button>
  </section>
</template>

<style scoped>
.Push {
  width: 100vw;
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>
