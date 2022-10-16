<script setup>
import {
  Application,
  Color,
  Entity,
  FILLMODE_FILL_WINDOW,
  RESOLUTION_AUTO
} from "playcanvas";

const BACKGNOUND_SHADE = 0.1;
const INITIAL_CAMERA_Z_POSITION = 6;
const INITIAL_LIGHT_X_ROTATION = 45;
const INITIAL_CUBE_ROTATION_SPEED = { x: 10, y: 20, z: 30 };

// TODO: do shit once canvas is loaded
const canvas = ref(null);

const app = new Application(canvas, {});
app.setCanvasFillMode(FILLMODE_FILL_WINDOW);
app.setCanvasResolution(RESOLUTION_AUTO);

window.addEventListener("resize", () => app.resizeCanvas());

// setup initial camera
const camera = new Entity("camera");
camera.addComponent("camera", {
  clearColor: new Color(
    BACKGNOUND_SHADE,
    BACKGNOUND_SHADE,
    BACKGNOUND_SHADE
  )
});

camera.setPosition(0, 0, INITIAL_CAMERA_Z_POSITION);
app.root.addChild(camera);

// setup initial light
const light = new Entity("light");
light.addComponent("light");
light.setEulerAngles(INITIAL_LIGHT_X_ROTATION, 0, 0);

app.root.addChild(light);

// setup initial cube
const cube = new Entity("cube");
cube.addComponent("model", {
  type: "box"
});

app.root.addChild(cube);

app.on("update", (deltaTime) => {
  cube.rotate(
    INITIAL_CUBE_ROTATION_SPEED.x * deltaTime,
    INITIAL_CUBE_ROTATION_SPEED.y * deltaTime,
    INITIAL_CUBE_ROTATION_SPEED.z * deltaTime
  );
});

// start app
app.start();
</script>

<template>
  <div class="DemoCanvas__container">
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