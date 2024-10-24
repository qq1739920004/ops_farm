<template>
  <div class="headDom">
    <div class="left">
      <div class="name-box flex-align-center ">
        <img v-if="config.img=='dealer'" class="name-img" src="../img/name_dealer_number.png" alt="">
        <img v-else-if="config.img=='device'" class="name-img" src="../img/name_device_number.png" alt="">
        <img v-else-if="config.img=='noExport'" class="name-img" src="../img/name_no_export_number.png" alt="">
        <img v-else-if="config.img=='export'" class="name-img" src="../img/name_statistical_export_number.png" alt="">
        <img v-else-if="config.img=='month'" class="name-img" src="../img/name_statistical_month_export_number.png" alt="">
        <img v-else-if="config.img=='overdue'" class="name-img" src="../img/name_statistical_overdue_number.png" alt="">
        <span class="name">{{ config.name }}</span>
      </div>
      <span class="number">{{ config.number }}</span>
    </div>
    <img v-if="config.img=='dealer'" class="rigth" src="../img/dealer_number.png" alt="">
    <img v-else-if="config.img=='device'" class="rigth" src="../img/device_number.png" alt="">
    <img v-else-if="config.img=='noExport'" class="rigth" src="../img/no_export_number.png" alt="">
    <img v-else-if="config.img=='export'" class="rigth" src="../img/statistical_export_number.png" alt="">
    <img v-else-if="config.img=='month'" class="rigth" src="../img/statistical_month_export_number.png" alt="">
    <img v-else-if="config.img=='overdue'" class="rigth" src="../img/statistical_overdue_number.png" alt="">

  </div>
</template>
<script setup lang="ts">
import {ref,reactive} from "vue"
defineProps({
  config: {
      type: Object,
      default: () => {}
      }
});


</script>

<style lang="scss" scoped>
.headDom {
  background-color:#ffffff;
  margin:0 3px;
  min-width: 245px;
  box-shadow: 0px 2px 12px -4px rgba(0,0,0,0.2);
  border-radius: 4px 4px 4px 4px;
  display: flex;
  align-content: center;
  .name-img{
    width: 16px;
    height: 16px;
    margin-right: 4px;
  }
  .left {
    width: 66%;
    height: 100%;
    box-sizing: border-box;
    padding: 10px 16px;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    .name-box{
      display: flex;
      align-content: center;
    }
    .name {
      font-weight: 400;
      color: #bfc3cc;
    }
   .number {
      font-family: D-DIN-DIN, D-DIN-DIN;
      font-weight: bold;
      font-size: 32px;
      color: #2E363D;
      line-height: 38px;
      letter-spacing: 3px;
      text-align: left;
      font-style: normal;
    }
  }
  .rigth {
    width: 34%;
    height: 100%;
    padding-top: 5px;
  }
}
</style>