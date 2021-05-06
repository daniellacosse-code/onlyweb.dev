<template>
  <game-of-life></game-of-life>
</template>

<script>
export default {
  components: {
    GameOfLife: () => import("@/components/GameOfLife.vue")
  }
};
</script>
