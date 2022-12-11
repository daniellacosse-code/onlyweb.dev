<script setup>
import {
  Game,
  GameScene,
  GameSceneCamera,
  GameSceneLight,
  GameSceneActor,
  GameStage,
  combineTransforms,
  keyboardBehaviorFactory
} from "@only-web/game";

const { public: { threeDimensional } } = useRuntimeConfig();

const canvas = ref(null);
const game = ref(null);

onMounted(() => {
  // Currently the stage must be set before the game is created, due to playcanvas' internal architecture.
  // I will not make the stage a positional argument, however, to keep our API more flexible.

  // We may want multiple stages to support split screen, for instance. 
  // Or no stage, to run a separate non-blocking simulation in a service worker.
  const mainStage = new GameStage({ stageElement: canvas.value });

  const mainScene = new GameScene({
    actors: {
      cube: new GameSceneActor({
        name: "Cube",
        model: "box",
        behaviors: {
          deviceRotation: orientationBehaviorFactory(({ self, orientation }) => {
            self.transform = { rotation: orientation };
          }),
          gamepadRotation: gamepadBehaviorFactory(({ setFrameSpeedTransform, gamepad: { analog } }) => {
            setFrameSpeedTransform({
              rotation: {
                x: analog.left.vertical * threeDimensional.rotationSpeedCube,
                y: analog.left.horizontal * threeDimensional.rotationSpeedCube,
              }
            });
          }),
          keyboardRotation: keyboardBehaviorFactory(({ setFrameSpeedTransform, keyboard: { ArrowUp, ArrowDown, ArrowLeft, ArrowRight } }) => {
            setFrameSpeedTransform(
              combineTransforms(
                ArrowUp && { rotation: { x: -1 * threeDimensional.rotationSpeedCube } },
                ArrowDown && { rotation: { x: threeDimensional.rotationSpeedCube } },
                ArrowLeft && { rotation: { y: -1 * threeDimensional.rotationSpeedCube } },
                ArrowRight && { rotation: { y: threeDimensional.rotationSpeedCube } }
              )
            );
          }),
        },
      })
    },
    backdrop: threeDimensional.colorBackground,
    cameras: {
      main: new GameSceneCamera({
        name: "Main Camera",
        transform: {
          position: threeDimensional.positionCamera
        }
      })
    },
    lights: {
      main: new GameSceneLight({
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