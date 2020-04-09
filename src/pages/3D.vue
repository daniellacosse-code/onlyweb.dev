<template>
  <div>
    <canvas class="DemoCanvas" ref="canvas" />
    <frame-ticker ref="ticker" class="DemoCanvas__stats"></frame-ticker>
  </div>
</template>

<script>
import FrameTicker from "../components/FrameTicker";
import {
  Application,
  Color,
  Entity,
  RESOLUTION_AUTO,
  FILLMODE_FILL_WINDOW,
} from "playcanvas";

export default {
  components: {
    FrameTicker,
  },
  methods: {
    init() {
      const canvas = this.$refs.canvas;
      const app = new Application(canvas, {});

      app.setCanvasFillMode(FILLMODE_FILL_WINDOW);
      app.setCanvasResolution(RESOLUTION_AUTO);

      window.addEventListener("resize", () => app.resizeCanvas());

      // setup initial camera
      const camera = new Entity("camera");

      camera.addComponent("camera", {
        clearColor: new Color(0.1, 0.1, 0.1),
      });

      camera.setPosition(0, 0, 6);

      app.root.addChild(camera);

      // setup initial light
      const light = new Entity("light");

      light.addComponent("light");

      light.setEulerAngles(45, 0, 0);

      app.root.addChild(light);

      // setup initial cube
      const cube = new Entity("cube");

      cube.addComponent("model", {
        type: "box",
      });

      app.root.addChild(cube);

      app.on("update", (deltaTime) => {
        cube.rotate(10 * deltaTime, 20 * deltaTime, 30 * deltaTime);

        if (this.$refs.ticker) this.$refs.ticker.tick();
      });

      // start app
      app.start();
    },
  },
  mounted() {
    this.init();
  },
};
</script>

<style scoped>
.DemoCanvas {
  position: fixed;
  top: 0;
  left: 0;
}

.DemoCanvas__stats {
  position: fixed;
  top: 50px;
  right: 0;
}
</style>
