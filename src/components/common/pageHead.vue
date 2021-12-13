<template>
  <div class="page_head_container">
    <h2>
      {{ $t(`message.${[title]}`) }}
    </h2>
    <div v-if="showBack" class="go_back" @click="goBack">
      <img src="@/assets/common/back.png" alt="" />
    </div>
  </div>
</template>

<script>
export default {
  props: {
    title: {
      type: String,
      default: 'title'
    },
    showBack: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {}
  },
  methods: {
    goBack() {
      this.$emit('back')
    }
  }
}
</script>
<style scoped lang ='scss'>
.page_head_container{
    position: relative;
    h2 {
        padding: 0 ;
        margin: 0;
        font-weight: normal;
        font-size: 100%;
        $height: 46px;
        height: $height;
        line-height: $height;
        text-align: left;
        padding-left: 60px;
        background: #f7f7f7;
        font-size: 18px;

    }
    .go_back {
        position: absolute;
        height: 100%;
        line-height: 46px;
        left: 20px;
        top: 0px;
        font-size: 20px;
        color: #1890FF;
        cursor: pointer;
        >img {
            position: relative;
            top: 2px;
        }

    }
}

</style>
