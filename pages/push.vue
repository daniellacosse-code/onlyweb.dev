<script>
import Vue from "vue";
import { Button } from "buefy";

Vue.use(Button);

export default {
  components: {
    Button
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
    }
  }
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
  align-items: center;
  display: flex;
  height: 100vh;
  justify-content: center;
  width: 100vw;
}
</style>
