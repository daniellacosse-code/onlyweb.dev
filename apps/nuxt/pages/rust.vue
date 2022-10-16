<script setup>
import Conway from "@only-web/conway";

const { public: { rust, BITS_PER_BYTE } } = useRuntimeConfig();

const container = ref(null);

let game = null;
let gameLoopID = null;
const isPlaying = computed(() => gameLoopID !== null);

const grid = ref(null);
let canvas = null;
let [width, height] = [0, 0];
let indexCache = [];

const cellBorderWidth = computed(() => rust.sizeCell + 1);

onMounted(() => {
  const width = Math.floor(
    container.offsetWidth / cellBorderWidth
  );
  const height = Math.floor(
    container.offsetHeight / cellBorderWidth
  );

  game = Conway.Universe.new(width, height);
  grid.width = width * cellBorderWidth + 1;
  grid.height = height * cellBorderWidth + 1;

  indexCache = Array.from(new Array(height), () => new Array(width));

  canvas = grid.getContext("2d");
  canvas.strokeStyle = rust.colorDefault;
  canvas.fillStyle = rust.colorBackground;

  redrawGame();
  startGame();
});

onUnmounted(() => {
  pauseGame();
  game.destroy();
});

function redrawGame() {
  canvas.clearRect(0, 0, grid.width, grid.height);

  // TODO: can I move these into here and only stroke once?
  redrawGrid();
  redrawCells();
}

function redrawGrid() {
  let [row, column] = [width, height];

  canvas.beginPath();

  while (row--) {
    canvas.moveTo(row * cellBorderWidth + 1, 0);
    canvas.lineTo(
      row * cellBorderWidth + 1,
      height * cellBorderWidth + 1
    );
  }

  while (column--) {
    canvas.moveTo(0, column * cellBorderWidth + 1);
    canvas.lineTo(
      width * cellBorderWidth + 1,
      column * cellBorderWidth + 1
    );
  }

  // I AM THE STORM THAT IS APPROACHING
  canvas.stroke();
}

function redrawCells() {
  const cellPointer = game.cells();
  const cells = new Uint8Array(
    Conway.memory.buffer,
    cellPointer,
    (width * height) / BITS_PER_BYTE
  );

  const getIndex = (row, column) => indexCache[row][column] !== null
    ? indexCache[row][column]
    : (indexCache[row][column] = row * width + column);

  const isCellAlive = (row, column, cells) => {
    const index = getIndex(row, column);
    const byteIndex = Math.floor(index / BITS_PER_BYTE);
    const byteMask = 1 << index % BITS_PER_BYTE;

    return (cells[byteIndex] & byteMask) === byteMask;
  };

  canvas.beginPath();

  let [row, column] = [height, width];
  while (row--) {
    while (column--) {
      if (isCellAlive(row, column, cells)) {
        canvas.fillRect(
          column * cellBorderWidth + 1,
          row * cellBorderWidth + 1,
          cellPixelSize,
          cellPixelSize
        );
      }
    }
  }

  canvas.stroke();
}

function startGame() {
  game.tick();
  redrawGame();
  gameLoopID = requestAnimationFrame(startGame);
}

function pauseGame() {
  cancelAnimationFrame(gameLoopID);
  gameLoopID = null;
}

function cellToggle({ clientX, clientY }) {
  const { width, height, left, top } = grid.getBoundingClientRect();

  const [scaleX, scaleY] = [grid.width / width, grid.height / height];
  const [canvasLeft, canvasTop] = [(clientX - left) * scaleX, (clientY - top) * scaleY];
  const [row, column] = [
    Math.min(Math.floor(canvasTop / cellBorderWidth), height - 1),
    Math.min(Math.floor(canvasLeft / cellBorderWidth), width - 1)
  ];

  game.toggle_cell(row, column);
  redrawGame();
}
</script>

<template>
  <div class="Game__container" ref="container">
    <canvas class="Game" ref="grid" @click="cellToggle" />

    <div class="Game__controlsContainer">
      <o-button v-if="isPlaying" @click.stop.prevent="pauseGame()"
        :right-icon="pause">
        pause
      </o-button>

      <o-button v-else variant="primary" @click.stop.prevent="startGame()"
        :right-icon="play">
        play
      </o-button>
    </div>
  </div>
</template>

<style scoped>
.Game__container,
.Game__controlsContainer {
  align-items: center;
  display: flex;
  justify-content: center;
}

.Game__container {
  flex-direction: column;
  height: 100%;
  overflow: hidden;
  position: relative;
  width: 100%;
}

.Game__controlsContainer {
  bottom: 0;
  box-sizing: border-box;
  padding: var(--gutter-large);
  position: fixed;
  width: 100%;
}
</style>