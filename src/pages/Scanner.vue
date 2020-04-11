<template>
  <div>
    <div ref="scanner"></div>
    <pre>{{ code }}</pre>
  </div>
</template>

<script>
import Quagga from "quagga";

export default {
  data: function() {
    return {
      code: "---"
    };
  },
  methods: {
    init() {
      Quagga.init(
        {
          inputStream: {
            name: "Live",
            type: "LiveStream",
            target: this.$refs.scanner
          },
          decoder: {
            readers: [
              "i2of5_reader",
              "code_128_reader",
              "ean_reader",
              "ean_8_reader",
              "code_39_reader",
              "code_39_vin_reader",
              "codabar_reader",
              "upc_reader",
              "upc_e_reader",
              "2of5_reader",
              "code_93_reader"
            ]
          }
        },
        error => {
          if (error) {
            alert(error);
          }

          this.$root.loading = false;

          Quagga.onDetected(data => {
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
  destroyed() {
    this.stop();
  }
};
</script>

<style>
.drawingBuffer {
  position: absolute;
}
</style>
