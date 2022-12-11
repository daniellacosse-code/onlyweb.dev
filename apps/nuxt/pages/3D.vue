<script setup>
import Game, { combineTransforms } from "@only-web/game";

const { public: { threeDimensional } } = useRuntimeConfig();

const canvas = ref(null);
const game = ref(null);

onMounted(/* async */() => {
  // Currently the stage must be set before the game is created, due to playcanvas' internal architecture.
  // I will not make the stage a positional argument, however, to keep our API more flexible.

  // We may want multiple stages to support split screen, for instance. 
  // Or no stage, to run a separate non-blocking simulation in a service worker.
  const mainStage = new Game.Stage({ stageElement: canvas.value });

  const mainScene = new Game.Scene({
    actors: {
      cube: new Game.Scene.Actor({
        name: "Cube",
        model: "box",
        updaters: {
          // deviceRotation: await Game.Scene.Object.Updater.Device(({ self, deviceTransform }) => (self.transform = deviceTransform)),
          gamepadRotation: Game.Scene.Object.Updater.Gamepad(({ updateWithSpeed, gamepad }) => {
            updateWithSpeed({
              rotation: {
                x: gamepad.analog.left.vertical * threeDimensional.rotationSpeedCube,
                y: gamepad.analog.left.horizontal * threeDimensional.rotationSpeedCube,
              }
            });
          }),
          keyboardRotation: Game.Scene.Object.Updater.Keyboard(({ updateWithSpeed, keyboard }) => {
            updateWithSpeed(
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
      main: new Game.Scene.Camera({
        name: "Main Camera",
        transform: {
          position: threeDimensional.positionCamera
        }
      })
    },
    lights: {
      main: new Game.Scene.Light({
        name: "Main Light",
        transform: {
          rotation: threeDimensional.rotationLight
        }
      })
    }
  });

  game.value = new Game({
    scenes: {
      main: mainScene
    },
    // TODO: stages?
    stage: mainStage
  });

  game.value.play();
});

onUnmounted(() => game.value.pause());
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