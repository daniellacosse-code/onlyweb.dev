<template>
  <div class="DemoCanvas__container">
    <canvas ref="canvas" class="DemoCanvas" />
    <frame-ticker ref="ticker" class="DemoCanvas__stats" />
  </div>
</template>

<script>
import FrameTicker from "@/components/FrameTicker.vue";
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

export default {
  components: {
    FrameTicker
  },
  methods: {
    init() {
      const { canvas } = this.$refs;
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

        if (this.$refs.ticker) this.$refs.ticker.tick();
      });

      // start app
      app.start();
    }
  },
  mounted() {
    this.init();
  }
};
</script>

<style scoped>
.DemoCanvas__container {
  position: relative;
}

.DemoCanvas {
  left: 0;
  position: absolute;
  top: 0;
}

.DemoCanvas__stats {
  position: absolute;
  right: 0;
  top: 50px;
}
</style>
