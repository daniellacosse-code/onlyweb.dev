<script setup>
import {
  Game,
  GameScene,
  GameSceneCamera,
  GameSceneLight,
  GameSceneActor,
  GameStage,
  combineTransforms
} from "@only-web/game";

const { public: { threeDimensional } } = useRuntimeConfig();

const canvas = ref(null);
const game = ref(null);

onMounted(() => {
  // currently the stage must be set before the game is created, due to playcanvas' internal architecture
  // I will not make this a positional argument, however, to keep the API flexible
  const stage = new GameStage({ stageElement: canvas.value });

  game.value = new Game({
    stage,
    scenes: {
      main: new GameScene({
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
        },
        actors: {
          cube: new GameSceneActor({
            name: "Cube",
            model: "box",
            behaviors: {
              idleRotation: ({ self, deltaTime }) => {
                self.transform = combineTransforms(
                  self.transform,
                  {
                    rotation: {
                      x: threeDimensional.rotationSpeedCube.x * deltaTime,
                      y: threeDimensional.rotationSpeedCube.y * deltaTime,
                      z: threeDimensional.rotationSpeedCube.z * deltaTime
                    }
                  }
                );
              }
            }
          })
        },
        background: threeDimensional.colorBackground
      })
    },
  });

  // game.value.play();
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