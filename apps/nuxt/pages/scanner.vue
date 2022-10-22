<script setup>
import Quagga from "@ericblade/quagga2";
import QrCodeReader from "@ericblade/quagga2-reader-qr";

const { public: { scanner: { readoutTextDefault, decoderReaders } } } = useRuntimeConfig();

let code = readoutTextDefault;
const scanner = ref(null);

onMounted(() => {
  Quagga.registerReader("qrcode", QrCodeReader);

  Quagga.init(
    {
      decoder: {
        readers: decoderReaders
      },
      inputStream: {
        name: "Live",
        target: scanner.value,
        type: "LiveStream"
      }
    },
    (error) => {
      if (error) return alert(error);

      Quagga.onDetected(({ codeResult }) => {
        requestAnimationFrame(() => code = codeResult.code);
      });

      Quagga.start();
    }
  );
});

onUnmounted(Quagga.stop);
</script>

<template>
  <div>
    <div ref="scanner" />
    <pre>{{ code }}</pre>
  </div>
</template>
