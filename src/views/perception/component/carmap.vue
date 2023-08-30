<template>
    <div class="box">
        <div class="charts" ref="bar">
        </div>

    </div>
</template>
    
<script setup lang='ts' >
import * as echarts from 'echarts'
import china from '../china.json'
import axios from "axios";
import { ref, watch, onUnmounted, onMounted } from 'vue'
const props = defineProps({
    provinceCars: {
        type: Object
    }
})
let dataList = [{
    name: '',
    cityName: '',
    totalNum: 3,
    onlineNum: 3,
    code: ''
}]
let cityCode = ref('')
let bar = ref();
let option = {
    series: [
        {
            type: "map",
            map: 'china', // 引入地图数据
        },
    ],
};
var mycharts: any;

const initEcharts = () => {
    mycharts = echarts.init(bar.value)
    echarts.registerMap('china', <any>china);
    mycharts.setOption(option)

}
onMounted(() => {

    initEcharts()
})
onUnmounted(() => {
    mycharts.dispose;
});

const getProvicne = (provinceAlphabet: any) => {
    let path = `https://geo.datav.aliyun.com/areas_v3/bound/${provinceAlphabet}_full.json`;
     axios.get(path).then((res) => {
        console.log(res)
        echarts.registerMap('mapname', res.data);
        changeOptions("mapname");
        mycharts.setOption(option, true);
    });


}

const changeOptions = (mapname: any) => {
    option = {
        series: [
            {
                type: "map",
                map: mapname, // 引入地图数据
            },
        ],
    };
}
watch(props, (newValue) => {

    dataList = JSON.parse(JSON.stringify(newValue.provinceCars))
    cityCode.value = dataList[0].code + '00'
    getProvicne(cityCode.value)


})

</script>
<style lang="scss" scoped>
.box {
    height: 100%;

    .charts {
        height: 100%;
    }

}
</style>