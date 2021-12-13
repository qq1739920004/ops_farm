<template>
  <div class="num_container" :style="styleObj">
    <div class="num_show" :style="transObj">
      <div v-for="item in num" :key="item" class="num">{{ item }}</div>
    </div>
  </div>
</template>

<script>
/* eslint-disable */
export default {
  props: ['number', 'styleSheet'],
  data() {
    return {
      num: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, '.'],
    }
  },
  computed: {
    transObj() {
      if (this.number === '.') {
        return {
          transform: `translateY(${-10 * this.styleSheet.fontSize + 'px'})`,
        }
      }
      return {
        transform: `translateY(${
          -this.number * this.styleSheet.fontSize + 'px'
        })`,
      }
    },
    styleObj() {
      return {
        height: `${this.styleSheet.fontSize}px`,
        lineHeight: `${this.styleSheet.fontSize}px`,
        fontSize: `${this.styleSheet.fontSize}px`,
        color: `${this.styleSheet.color}`,
        fontWeight: `${this.styleSheet.fontWeight}`,
        letterSpacing: `${this.styleSheet.letterSpacing}`,
        fontFamily: `${this.styleSheet.fontFamily}`,
      }
    },
  },
}
</script>
<style scoped>
.num_container {
  width: fit-content;
  overflow: hidden;
}
.num_show {
  transition: all 1s;
}
.num_container > .num {
}
</style>