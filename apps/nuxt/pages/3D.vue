<script setup>
import {
  Application,
  Color,
  Entity,
  FILLMODE_FILL_WINDOW,
  RESOLUTION_AUTO
} from "playcanvas";

const { public: { threeDimensional } } = useRuntimeConfig();
const canvas = ref(null);

onMounted(() => {
  const app = new Application(canvas, {});

  app.setCanvasFillMode(FILLMODE_FILL_WINDOW);
  app.setCanvasResolution(RESOLUTION_AUTO);

  window.addEventListener("resize", () => app.resizeCanvas());

  // setup camera
  const camera = new Entity("camera");
  camera.addComponent("camera", {
    clearColor: new Color(
      ...threeDimensional.colorBackground,
    )
  });

  camera.setPosition(...threeDimensional.positionCamera);
  app.root.addChild(camera);

  // setup light
  const light = new Entity("light");
  light.addComponent("light");
  light.setEulerAngles(...threeDimensional.rotationLight);

  app.root.addChild(light);

  // setup cube
  const cube = new Entity("cube");
  cube.addComponent("model", {
    type: "box"
  });

  app.root.addChild(cube);

  // start app
  app.on("update", (deltaTime) => {
    cube.rotate(
      ...threeDimensional.rotationSpeedCube.map((dimension) => dimension * deltaTime)
    );
  });
  app.start();
});
</script>

<template>
  <div class="ThreeDimensionalCanvas__container">
    <canvas ref="canvas" class="ThreeDimensionalCanvas" />
  </div>
</template>

<style scoped>
.ThreeDimensionalCanvas__container {
  height: 100%;
  overflow: hidden;
  position: relative;
  width: 100%;
}

.ThreeDimensionalCanvas {
  left: 0;
  position: absolute;
  top: 0;
}
</style>