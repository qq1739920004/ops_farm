<template>
  <div class="count_container">
    <realtime-count />
    <chart />
  </div>
</template>

<script>
import realtimeCount from './components/realtimeCount.vue'
import chart from './components/chart.vue'
export default {
  components: {
    realtimeCount,
    chart
  },
  data() {
    return {}
  }
}
</script>
<style scoped lang="scss">
.count_container {
  height: 100%;
}
</style>
