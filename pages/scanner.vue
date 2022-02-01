<template>
  <div>
    <div ref="scanner" />
    <pre>{{ code }}</pre>
  </div>
</template>

<script>
import Quagga from "quagga";

export default {
  data: function () {
    return {
      code: "---"
    };
  },
  methods: {
    init() {
      Quagga.init(
        {
          decoder: {
            readers: ["upc_reader", "upc_e_reader"]
          },
          inputStream: {
            name: "Live",
            target: this.$refs.scanner,
            type: "LiveStream"
          }
        },
        (error) => {
          if (error) {
            alert(error);
          }

          Quagga.onDetected((data) => {
            requestAnimationFrame(() => {
              this.$set(this, "code", data.codeResult.code);
            });
          });
          Quagga.start();
        }
      );
    },
    stop() {
      Quagga.stop();
    }
  },
  mounted() {
    this.init();
  },
  unmounted() {
    this.stop();
  }
};
</script>

<style>
.drawingBuffer {
  position: absolute;
}
</style>
