<template>
  <aside class="Stats">
    <div v-if="frames.length >= windowSize">
      <trend
        class="Stats__chart"
        :data="frames"
        :max="maxRate"
        :min="minRate"
      ></trend>
      min fps: {{ minFPS.peek() }} | max fps: {{ maxFPS.peek() }} | avg fps:
      {{ average }}
    </div>
    <div v-else>Waiting...</div>
  </aside>
</template>

<script>
import Trend from "vuetrend";
import { MinHeap, MaxHeap } from "@/plugins/heap";

export default {
  components: {
    Trend,
  },
  props: {
    windowSize: {
      type: Number,
      default: 100,
    },
  },
  data: function() {
    return {
      frames: [],
      maxRate: 60,
      minRate: 0,
      minFPS: new MinHeap(),
      maxFPS: new MaxHeap(),
      sum: 0,
      lastTimestamp: null,
    };
  },
  computed: {
    average() {
      return Math.floor(this.sum / this.frames.length);
    },
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

      const fps = Math.floor(1000 / delta);

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
    },
  },
};
</script>

<style scoped>
.Stats {
  opacity: 0.5;
  font-family: "Menlo", monospace;
  text-align: left;
  cursor: pointer;
  background: white;
  padding: 10px 15px;
}

.Stats > div {
  display: inline-flex;
  justify-content: center;
  align-items: center;
}

.Stats__chart {
  width: 200px;
  height: 50px;
  margin-right: 15px;
}

.Stats:hover {
  opacity: 1;
}
</style>
