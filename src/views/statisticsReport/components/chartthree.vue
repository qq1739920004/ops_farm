
<template>
    <div class="rank">
        <div class="rank_item" v-for="(item, index) in carlist" :key="index">

            <div class="rank_picture">
                <img src="">
                <h3>{{ item.name }}</h3>
            </div>
            <div class="rank-ability">{{ item.carnum }}台</div>
        </div>
    </div>
</template>

<script lang="ts" setup>
import { reactive } from 'vue'
const carlist = reactive([{ rank: 1, name: 'xinjiang', carnum: 200 },
{ rank: 2, name: 'xinjiang', carnum: 20 },
{ rank: 3, name: 'xinjiang', carnum: 2 }])

</script>


<style scoped lang="scss">
.rank {

    .rank_item {
        display: flex;
        margin-top: 10px;
        width: 100%;

        .rank_picture {
            margin-left: 40px;
            width: 50%;

            h3 {
                display: inline;
                margin-left: 20px;
            }
        }

        .rank-ability {
            width: 20%;
            margin-left: 180px
        }
    }
}
</style>

