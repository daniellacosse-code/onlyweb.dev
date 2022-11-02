<script setup>
import Conway__init, { Universe } from "@only-web/conway";

const wasm = ref(null);
const { public: { rust, BITS_PER_BYTE } } = useRuntimeConfig();

const container = ref(null);

let game = null;
let gameLoopID = null;
const isPlaying = ref(false);

const grid = ref(null);
let canvas = null;
let [width, height] = [0, 0];
let indexCache = [];

const cellBorderWidth = rust.sizeCell + 1;

onMounted(async () => {
  await nextTick();

  wasm.value = await Conway__init();

  width = Math.ceil(
    container.value.offsetWidth / cellBorderWidth
  );
  height = Math.ceil(
    container.value.offsetHeight / cellBorderWidth
  );

  game = Universe.new(width, height);
  indexCache = Array.from(new Array(height), () => new Array(width));

  grid.value.width = width * cellBorderWidth + 1;
  grid.value.height = height * cellBorderWidth + 1;

  canvas = grid.value.getContext("2d");
  canvas.strokeStyle = rust.colorDefault;
  canvas.fillStyle = rust.colorDefault;

  redrawGame();
});

onUnmounted(() => {
  pauseGame();
  game.destroy();
});

function redrawGame() {
  canvas.clearRect(0, 0, grid.value.width, grid.value.height);

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
    wasm.value.memory.buffer,
    cellPointer,
    (width * height) / BITS_PER_BYTE
  );

  const getIndex = (row, column) => indexCache[row][column] !== undefined
    ? indexCache[row][column]
    : (indexCache[row][column] = row * width + column);

  const isCellAlive = (row, column, cells) => {
    const index = getIndex(row, column);
    const byteIndex = Math.floor(index / BITS_PER_BYTE);
    const byteMask = 1 << index % BITS_PER_BYTE;

    return (cells[byteIndex] & byteMask) === byteMask;
  };

  canvas.beginPath();

  let row = height;
  while (row--) {
    let column = width;
    while (column--) {
      if (isCellAlive(row, column, cells)) {
        canvas.fillRect(
          column * cellBorderWidth + 1,
          row * cellBorderWidth + 1,
          cellBorderWidth,
          cellBorderWidth
        );
      }
    }
  }

  canvas.stroke();
}

function startGame() {
  game.tick();
  redrawGame();
  isPlaying.value = true;
  gameLoopID = requestAnimationFrame(startGame);
}

function pauseGame() {
  cancelAnimationFrame(gameLoopID);
  isPlaying.value = false;
  gameLoopID = null;
}

function cellToggle({ clientX, clientY }) {
  const { width, height, left, top } = grid.value.getBoundingClientRect();

  const [scaleX, scaleY] = [grid.value.width / width, grid.value.height / height];
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
      <button v-if="isPlaying" @click.stop.prevent="pauseGame()">
        ⏸ pause
      </button>

      <button v-else variant="primary" @click.stop.prevent="startGame()">
        ▶️ play
      </button>
    </div>
  </div>
</template>

<style scoped>
.Game__container {
  display: block;
  width: 100%;
  height: 100%;
  overflow: hidden;
  position: fixed;
}

.Game__controlsContainer {
  align-items: center;
  bottom: 0;
  box-sizing: border-box;
  display: flex;
  justify-content: center;
  padding: var(--size-large);
  position: fixed;
  width: 100%;
}
</style>