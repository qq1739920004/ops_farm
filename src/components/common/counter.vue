<template>
  <div class="counter_container">
    <div class="prefix">{{ prefix.content }}</div>
    <div
      v-for="(item, index) in splitNum"
      :key="index"
      class="splitNum_container"
    >
      <counterItem :number="item" :style-sheet="styleSheet" />
    </div>
  </div>
</template>
<script>
/* eslint-disable */
import counterItem from './counterItem'
export default {
  props: {
    number: {
      type: Number,
      default: 0,
    },
    styleSheet: {
      type: Object,
      default: function () {
        return {
          fontSize: 20,
          color: '#fff',
          fontWeight: 'normal',
          letterSpacing: 'normal',
          fontFamily: 'DS-Digital',
        }
      },
    },
    prefix: {
      type: Object,
      default: function () {
        return {
          content: '',
        }
      },
    },
    suffix: {
      type: Object,
      default: function () {
        return {
          content: '',
        }
      },
    },
  },
  data() {
    return {}
  },
  computed: {
    splitNum() {
      return this.number.toString().split('')
    },
  },
  components: {
    counterItem,
  },
}
</script>
<style scoped>
.counter_container {
  display: flex;
  align-items: center;
  align-content: center;
  justify-content: center;
  font-size: initial;
  height: initial;
  line-height: initial;
  text-align: center;
}
.splitNum_container {
  display: inline-block;
}
</style>