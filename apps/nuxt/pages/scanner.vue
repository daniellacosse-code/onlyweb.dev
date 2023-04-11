<script setup>
const {
  public: {
    scanner: { readoutTextDefault, decoderReaders }
  }
} = useAppConfig();
const nuxtApp = useNuxtApp();

const scanner = ref(null);
const data = ref("");
const isLoading = ref(true);

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
        requestAnimationFrame(() => (data.value = codeResult.code));
      });

      nuxtApp.$quagga.start();
      isLoading.value = false;
    }
  );
});

onUnmounted(() => nuxtApp.$quagga?.stop());
</script>

<template>
  <div class="Quagga">
    <div
      :class="{ Quagga__scanner: true, 'Quagga__scanner--loading': isLoading }"
      ref="scanner"
    ></div>
    <pre>{{ isLoading ? "Loading..." : data || readoutTextDefault }}</pre>
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
  display: flex;
  justify-content: center;
  position: relative;
  opacity: 1;
  transition: opacity ease 350ms;
}

.Quagga__scanner--loading {
  min-height: 480px;
  opacity: 0;
}

.Quagga__scanner > .drawingBuffer {
  position: absolute;
  left: 0;
}

.Quagga__scanner > video {
  width: 100%;
  max-width: var(--device-width-tablet);
  object-fit: contain;
}

.Quagga > pre {
  font-family: var(--font-monospace);
  padding: var(--size-default);
  color: var(--color-text);
  cursor: inherit;
  background: var(--color-highlight);
  text-align: center;
}
</style>
