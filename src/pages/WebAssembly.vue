<template>
  <game-of-life></game-of-life>
</template>

<script>
export default {
  components: {
    GameOfLife: () =>
      import(/* webpackChunkName: "gameOfLife" */ "@/components/GameOfLife.vue")
  }
};
</script>
