<script setup>

const { public: { scanner: { readoutTextDefault, decoderReaders } } } = useRuntimeConfig();
const nuxtApp = useNuxtApp();

const scanner = ref(null);
const data = ref(readoutTextDefault);

onMounted(async () => {
  await nextTick();

  nuxtApp.$quagga.init(
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

      nuxtApp.$quagga.onDetected(({ codeResult }) => {
        requestAnimationFrame(() => data.value = codeResult.code);
      });

      nuxtApp.$quagga.start();
    }
  );
});

onUnmounted(nuxtApp.$quagga.stop);
</script>

<template>
  <div class="Quagga">
    <div class="Quagga__scanner" ref="scanner" />
    <pre>{{ data }}</pre>
  </div>
</template>

<!-- scoping doesn't work with the injected drawing buffer canvas -->
<style>
.Quagga {
  display: flex;
  flex-direction: column;
  margin: auto;
}

.Quagga__scanner {
  position: relative;
}

.Quagga__scanner>.drawingBuffer {
  position: absolute;
  left: 0;
}

.Quagga>pre {
  font-family: var(--font-monospace);
  padding: var(--size-default);
  color: inherit;
  cursor: inherit;
  background: var(--color-background);
  border-radius: var(--size-small);
  text-align: center;
}
</style>