<script setup>
import Play, { Scene, Stage, Updater, combineTransforms } from "@only-web/play";

const { public: { threeDimensional } } = useRuntimeConfig();

const canvas = ref(null);
const play = ref(null);

onMounted(/* async */() => {
  // Currently the stage must be set before the play is initialized, due to playcanvas' internal architecture.
  // I will not make the stage a positional argument, however, to keep our API more flexible.

  // We may want multiple stages to support split screen, for instance. 
  // Or no stage, to run a separate non-blocking simulation in a service worker.
  const mainStage = new Stage({ stageElement: canvas.value });

  const mainScene = new Scene({
    actors: {
      cube: new Scene.Actor({
        name: "Cube",
        model: "box",
        updaters: {
          // deviceRotation: await Updater.Device(({ device, self }) => (self.transform = device.transform)),
          gamepadRotation: Updater.Gamepad(({ gamepad, withSpeed }) => {
            withSpeed({
              rotation: {
                x: gamepad.analog.left.vertical * threeDimensional.rotationSpeedCube,
                y: gamepad.analog.left.horizontal * threeDimensional.rotationSpeedCube,
              }
            });
          }),
          keyboardRotation: Updater.Keyboard(({ keyboard, withSpeed }) => {
            withSpeed(
              combineTransforms(
                keyboard.ArrowUp && { rotation: { x: -1 * threeDimensional.rotationSpeedCube } },
                keyboard.ArrowDown && { rotation: { x: threeDimensional.rotationSpeedCube } },
                keyboard.ArrowLeft && { rotation: { y: -1 * threeDimensional.rotationSpeedCube } },
                keyboard.ArrowRight && { rotation: { y: threeDimensional.rotationSpeedCube } }
              )
            );
          }),
        },
      })
    },
    backdrop: threeDimensional.colorBackground,
    cameras: {
      __main__: new Scene.Camera({
        name: "Main Camera",
        transform: {
          position: threeDimensional.positionCamera
        }
      })
    },
    lights: {
      __main__: new Scene.Light({
        name: "Main Light",
        transform: {
          rotation: threeDimensional.rotationLight
        }
      })
    }
  });

  play.value = new Play({
    scenes: {
      __main__: mainScene
    },
    // TODO: stages?
    stage: mainStage
  });

  play.value.start();
});

onUnmounted(() => play.value.pause());
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
  position: absolute;
  width: 100%;
}

.ThreeDimensionalCanvas {
  left: 0;
  position: absolute;
  top: 0;
}
</style>