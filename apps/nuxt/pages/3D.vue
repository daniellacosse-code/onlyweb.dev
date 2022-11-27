<script setup>
import { Game, GameScene, GameSceneCamera, GameSceneLight, GameSceneActor, combineTransforms, bootstrapPlaycanvas } from "@only-web/game";

const { public: { threeDimensional } } = useRuntimeConfig();

bootstrapPlaycanvas();

const canvas = ref(null);
const game = ref(new Game({
  stage: new GameStage({ renderElement: canvas.value }),
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
          name: "Cube Actor",
          model: "box",
          updaters: {
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
}));

onMounted(game.play);
onUnmounted(game.pause);
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