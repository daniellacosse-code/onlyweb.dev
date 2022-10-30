import Quagga from "@ericblade/quagga2";
import QrCodeReader from "@ericblade/quagga2-reader-qr";

export default defineNuxtPlugin((nuxtApp) => {
  Quagga.registerReader("qrcode", QrCodeReader);

  nuxtApp.provide("quagga", Quagga);
});
