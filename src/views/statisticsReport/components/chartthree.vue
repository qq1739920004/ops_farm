
<template>
    <div class="rank">
        <div class="rank_item" v-for="(item,index) in farmMachineData?.provinceRank">
            <div class="rank_picture">
                <img v-if="index==0" src="@/assets/statisticsReport/one.png">
                <img v-if="index==1" src="@/assets/statisticsReport/two.png">
                <img v-if="index==2" src="@/assets/statisticsReport/three.png">
                <div>{{ item.name }}</div>
            </div>
            <div class="rank-ability">{{ item.online }}台</div>
        </div>
    </div>
</template>

<script lang="ts" setup>

import { watch, ref, PropType, onMounted } from 'vue';
import type { FarmMachineObj } from '@/api/statisticsReport/type';

const props = defineProps({
    farmMachineData: {
        type: Object as PropType<FarmMachineObj>
    }
})
const fmData = ref<FarmMachineObj>()

onMounted(() => {
    fmData.value = props.farmMachineData
})

watch(props, (newValue) => {
    fmData.value = newValue.farmMachineData  

});
</script>


<style scoped lang="scss">
.rank {

    .rank_item {
        display: flex;
        // border: 1px solid red;
        margin: 15px 0 0 10px;
        justify-content: space-between;

        .rank_picture {
            width: 50%;
            display: flex;
            align-items: center;
            div {
                display: inline;
                margin-left: 20px;
                font-weight:bolder ;
                font-size: 20px;
                vertical-align:bottom;
            }
        }

        .rank-ability {
            width: 20%;
            // margin-left: 180px
        }
    }
}
</style>

