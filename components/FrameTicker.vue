<template>
  <aside class="Stats">
    <div v-if="frames.length >= windowSize">
      <trend
        class="Stats__chart"
        :data="frames"
        :max="maxRate"
        :min="minRate"
      />
      min fps: {{ minFPS.peek() }} | max fps: {{ maxFPS.peek() }} | avg fps:
      {{ average }}
    </div>
    <div v-else>Waiting...</div>
  </aside>
</template>

<script>
import Trend from "vuetrend";
import { MaxHeap, MinHeap } from "@/plugins/heap";

const MILLISECONDS = 1000;

export default {
  components: {
    Trend
  },
  computed: {
    average() {
      return Math.floor(this.sum / this.frames.length);
    }
  },
  data: function () {
    return {
      frames: [],
      lastTimestamp: null,
      maxFPS: new MaxHeap(),
      maxRate: 60,
      minFPS: new MinHeap(),
      minRate: 0,
      sum: 0
    };
  },
  methods: {
    clear() {
      this.frames = [];
      this.minFPS = new MinHeap();
      this.maxFPS = new MaxHeap();
      this.sum = 0;
      this.lastTimestamp = null;
    },
    tick() {
      const now = performance.now();

      if (this.lastTimestamp === null) {
        this.lastTimestamp = now;
        return;
      }

      const delta = now - this.lastTimestamp;
      this.lastTimestamp = now;

      const fps = Math.floor(MILLISECONDS / delta);

      this.sum += fps;

      this.frames.push(fps);
      this.minFPS.push(fps);
      this.maxFPS.push(fps);

      if (this.frames.length > this.windowSize) {
        const lastFPS = this.frames.shift();
        this.sum -= lastFPS;
        this.minFPS.remove(lastFPS);
        this.maxFPS.remove(lastFPS);
      }
    }
  },
  props: {
    windowSize: {
      default: 100,
      type: Number
    }
  }
};
</script>

<style scoped>
.Stats {
  background: white;
  cursor: pointer;
  font-family: "Menlo", monospace;
  opacity: 0.5;
  padding: 10px 15px;
  text-align: left;
}

.Stats > div {
  align-items: center;
  display: inline-flex;
  justify-content: center;
}

.Stats__chart {
  height: 50px;
  margin-right: 15px;
  width: 200px;
}

.Stats:hover {
  opacity: 1;
}
</style>
