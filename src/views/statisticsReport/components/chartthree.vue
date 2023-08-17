
<template>
    <div class="rank">
        <div class="rank_item">
            <div class="rank_picture">
                <img src="@/assets/statisticsReport/one.png">
                <div>{{ farmMachineData?.provinceRank[0].name }}</div>
            </div>
            <div class="rank-ability">{{ farmMachineData?.provinceRank[0].online }}台</div>
        </div>

        <div class="rank_item">
            <div class="rank_picture">
                <img src="@/assets/statisticsReport/two.png">
                <div>{{ farmMachineData?.provinceRank[1].name }}</div>
            </div>
            <div class="rank-ability">{{ farmMachineData?.provinceRank[1].online }}台</div>
        </div>

        <div class="rank_item">
            <div class="rank_picture">
                <img src="@/assets/statisticsReport/three.png">
                <div>{{ farmMachineData?.provinceRank[2].name }}</div>
            </div>
            <div class="rank-ability">{{ farmMachineData?.provinceRank[2].online }}台</div>
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
    console.log('ccfarmMachineData', props.farmMachineData?.provinceRank[1])
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

