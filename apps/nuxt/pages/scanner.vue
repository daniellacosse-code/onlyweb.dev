<template>TODO</template>

<script setup>
import Quagga from "@ericblade/quagga2";
import QrCodeReader from "@ericblade/quagga2-reader-qr";

const { public: { scanner } } = getRuntimeConfig();

let code = scanner.readoutTextDefault;
const scannerElement = ref(null);

onMounted(() => {
  Quagga.registerReader("qrcode", QrCodeReader);

  Quagga.init(
    {
      decoder: {
        readers: scanner.decoderReaders
      },
      inputStream: {
        name: "Live",
        target: scannerElement,
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
    <div ref="scannerElement" />
    <pre>{{ code }}</pre>
  </div>
</template>
