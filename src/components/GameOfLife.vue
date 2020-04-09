<template>
  <div class="Game__container" ref="gameContainer">
    <frame-ticker ref="ticker" class="Game__stats"></frame-ticker>

    <canvas class="Game" ref="gameGrid" @click="cellToggle"></canvas>
    <div class="Game__pauseContainer">
      <b-button
        type="is-primary"
        class="Game__pause"
        @click="playToggle"
        :icon-right="isPlaying ? playIcon : pauseIcon"
      ></b-button>
    </div>
  </div>
</template>

<script>
import Vue from "vue";
import { Universe } from "wasm-game-of-life";
import { memory } from "wasm-game-of-life/wasm_game_of_life_bg";
import { Button } from "buefy";
import FrameTicker from "./FrameTicker";

// TODO: configure buefy to use icons
Vue.use(Button);

export default {
  components: {
    FrameTicker,
  },
  props: {
    cellPixelSize: { type: Number, default: 10 },
    gridHexColor: { type: String, default: "#CCCCCC" },
    cellHexColor: { type: String, default: "#000000" },
  },
  data: function () {
    return {
      playIcon: "play",
      pauseIcon: "pause",
      width: 0,
      height: 0,
      frame: 0,
      indexCache: [],
      context: null,
      animationID: null,
      universe: null,
    };
  },
  computed: {
    isPlaying() {
      return this.animationID !== null;
    },
    cellBorderWidth() {
      return this.cellPixelSize + 1;
    },
  },
  methods: {
    init() {
      // TODO: fix weird "square-only" issue
      const { gameContainer, gameGrid } = this.$refs;
      const width = Math.floor(
        gameContainer.offsetWidth / this.cellBorderWidth
      );
      const height = Math.floor(
        gameContainer.offsetHeight / this.cellBorderWidth
      );

      this.universe = Universe.new(width, height);

      gameGrid.height = this.cellBorderWidth * height + 1;
      gameGrid.width = this.cellBorderWidth * width + 1;

      this.indexCache = Array(height)
        .fill(null)
        .map(() => Array(width));

      this.context = gameGrid.getContext("2d");
      this.context.strokeStyle = this.gridHexColor;
      this.context.fillStyle = this.cellHexColor;

      this.width = width;
      this.height = height;

      this.redrawGame();
      this.startRenderLoop();
    },
    redrawGame() {
      if (this.$refs.gameGrid) {
        this.context.clearRect(
          0,
          0,
          this.$refs.gameGrid.width,
          this.$refs.gameGrid.height
        );
      }

      this.redrawGrid();
      this.redrawCells();
    },
    startRenderLoop() {
      this.universe.tick();

      if (this.$refs.ticker) this.$refs.ticker.tick();

      this.redrawGame();
      this.animationID = requestAnimationFrame(this.startRenderLoop);
    },
    playToggle() {
      this.$refs.ticker.clear();

      if (this.isPlaying) {
        cancelAnimationFrame(this.animationID);
        this.animationID = null;
      } else {
        this.startRenderLoop();
      }
    },
    cellToggle(event) {
      const { min, floor } = Math;
      const { width, height, cellBorderWidth } = this;
      const { gameGrid } = this.$refs;

      const boundingRect = gameGrid.getBoundingClientRect();

      const scaleX = gameGrid.width / boundingRect.width;
      const scaleY = gameGrid.height / boundingRect.height;

      const canvasLeft = (event.clientX - boundingRect.left) * scaleX;
      const canvasTop = (event.clientY - boundingRect.top) * scaleY;

      const row = min(floor(canvasTop / cellBorderWidth), height - 1);
      const column = min(floor(canvasLeft / cellBorderWidth), width - 1);

      this.universe.toggle_cell(row, column);
      this.redrawGame();
    },
    getIndex(row, column) {
      if (this.indexCache[row][column]) return this.indexCache[row][column];

      return (this.indexCache[row][column] = row * this.width + column);
    },
    isAlive(row, column, cells) {
      const index = this.getIndex(row, column);
      const byteIndex = Math.floor(index / 8);

      const mask = 1 << index % 8;

      return (cells[byteIndex] & mask) === mask;
    },
    redrawGrid() {
      const { context, cellBorderWidth, width, height } = this;

      context.beginPath();

      let __row = width;
      while (__row--) {
        context.moveTo(__row * cellBorderWidth + 1, 0);
        context.lineTo(
          __row * cellBorderWidth + 1,
          cellBorderWidth * height + 1
        );
      }

      let __column = height;
      while (__column--) {
        context.moveTo(0, __column * cellBorderWidth + 1);
        context.lineTo(
          cellBorderWidth * width + 1,
          __column * cellBorderWidth + 1
        );
      }

      context.stroke();
    },
    redrawCells() {
      const {
        context,
        universe,
        width,
        height,
        isAlive,
        cellPixelSize,
        cellBorderWidth,
      } = this;

      const cellPointer = universe.cells();
      const cells = new Uint8Array(
        memory.buffer,
        cellPointer,
        (width * height) / 8
      );

      context.beginPath();
      let __row = height;
      while (__row--) {
        let __column = width;
        while (__column--) {
          if (isAlive(__row, __column, cells)) {
            context.fillRect(
              __row * cellBorderWidth + 1,
              __column * cellBorderWidth + 1,
              cellPixelSize,
              cellPixelSize
            );
          }
        }
      }

      context.stroke();
    },
  },
  mounted() {
    this.init();
  },
};
</script>

<style scoped lang="scss">
@import "~bulma";
/* @import "~buefy/src/scss/components/_icon"; */

.Game__container,
.Game__pauseContainer {
  display: flex;
  justify-content: center;
  align-items: center;
}

.Game__container {
  width: 100vw;
  height: 100vh;

  position: fixed;
  top: 0;
  flex-direction: column;
}

.Game__stats {
  position: fixed;
  top: 50px;
  right: 0;
}
/* .Game {} */

.Game__pauseContainer {
  width: 100%;
  position: absolute;
  bottom: 0;
  box-sizing: border-box;
  padding: 10px;
}

/* .Game__pause {} */
</style>
