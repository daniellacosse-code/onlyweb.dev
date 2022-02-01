<template>
  <div class="Game__container" ref="gameContainer">
    <frame-ticker ref="ticker" class="Game__stats" />

    <canvas class="Game" ref="gameGrid" @click="cellToggle" />
    <div class="Game__pauseContainer">
      <b-button type="is-primary" class="Game__pause" @click="playToggle">
        {{ isPlaying ? "pause ⏸" : "play ▶️" }}
      </b-button>
    </div>
  </div>
</template>

<script>
import { Button } from "buefy";
import FrameTicker from "@/components/FrameTicker.vue";
import { Universe as Game } from "@/plugins/conway/pkg";
import { memory as gameMemory } from "@/plugins/conway/pkg/lib_bg";
import Vue from "vue";

const BYTE_SIZE = 8;

Vue.use(Button);

export default {
  beforeUnmount() {
    this.stopAnimationLoop();
    this.game.destroy();
  },
  components: {
    FrameTicker
  },
  computed: {
    cellBorderWidth() {
      return this.cellPixelSize + 1;
    },
    isPlaying() {
      return this.animationID !== null;
    }
  },
  data: function () {
    return {
      animationID: null,
      context: null,
      frame: 0,
      game: null,
      height: 0,
      indexCache: [],
      pauseIcon: "pause",
      playIcon: "play",
      width: 0
    };
  },
  methods: {
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

      this.game.toggle_cell(row, column);
      this.redrawGame();
    },
    getIndex(row, column) {
      if (this.indexCache[row][column]) return this.indexCache[row][column];

      return (this.indexCache[row][column] = row * this.width + column);
    },
    init() {
      const { gameContainer, gameGrid } = this.$refs;
      const width = Math.floor(
        gameContainer.offsetWidth / this.cellBorderWidth
      );
      const height = Math.floor(
        gameContainer.offsetHeight / this.cellBorderWidth
      );

      this.game = Game.new(width, height);

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
    isAlive(row, column, cells) {
      const index = this.getIndex(row, column);
      const byteIndex = Math.floor(index / BYTE_SIZE);

      const mask = 1 << index % BYTE_SIZE;

      return (cells[byteIndex] & mask) === mask;
    },
    playToggle() {
      this.$refs.ticker.clear();

      if (this.isPlaying) {
        this.stopAnimationLoop();
      } else {
        this.startRenderLoop();
      }
    },
    redrawCells() {
      const {
        context,
        game,
        width,
        height,
        isAlive,
        cellPixelSize,
        cellBorderWidth
      } = this;

      const cellPointer = game.cells();
      const cells = new Uint8Array(
        gameMemory.buffer,
        cellPointer,
        (width * height) / BYTE_SIZE
      );

      context.beginPath();
      let __row = height;
      while (__row--) {
        let __column = width;
        while (__column--) {
          if (isAlive(__row, __column, cells)) {
            context.fillRect(
              __column * cellBorderWidth + 1,
              __row * cellBorderWidth + 1,
              cellPixelSize,
              cellPixelSize
            );
          }
        }
      }

      context.stroke();
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
    startRenderLoop() {
      this.game.tick();

      if (this.$refs.ticker) this.$refs.ticker.tick();

      this.redrawGame();
      this.animationID = requestAnimationFrame(this.startRenderLoop);
    },
    stopAnimationLoop() {
      cancelAnimationFrame(this.animationID);
      this.animationID = null;
    }
  },
  mounted() {
    this.init();
  },
  props: {
    cellHexColor: {
      default: "#000000",
      type: String
    },
    cellPixelSize: {
      default: 10,
      type: Number
    },
    gridHexColor: {
      default: "#CCCCCC",
      type: String
    }
  }
};
</script>

<style scoped>
.Game__container,
.Game__pauseContainer {
  align-items: center;
  display: flex;
  justify-content: center;
}

.Game__container {
  flex-direction: column;
  height: 100vh;

  position: relative;
  width: 100vw;
}

.Game__stats {
  position: absolute;
  right: 0;
  top: var(--gutter-extra-large);
}
/* .Game {} */

.Game__pauseContainer {
  bottom: 0;
  box-sizing: border-box;
  padding: var(--gutter-large);
  position: fixed;
  width: 100%;
}

/* .Game__pause {} */
</style>
