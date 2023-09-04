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
import { ref,  onUnmounted, onMounted } from 'vue'
import type { MonitorObj } from '@/api/perception/type'
let imageUrl = 'https://lmg.jj20.com/up/allimg/1112/031119144257/1Z311144257-6-1200.jpg'
interface Props {
    provinceCars: MonitorObj['provinceCars']
}
const props = withDefaults(defineProps<Props>(), {
    provinceCars:()=>[
      {
        name: '',
        totalNum: 0,
        onlineNum: 0,
        code: ''
      }
    ]
})
let dataList = props.provinceCars
let cityCode = ref('')
let bar = ref();
cityCode.value = dataList[0].code + '00'
let option:any = {
     // 定义地图
     series: [
        {
            type: "map",
            map: 'china', // 引入地图数据
            // 使用地图的itemStyle来实现影像图层
            itemStyle: {
                color: {
                    image: imageUrl, // 使用影像图作为填充
                    repeat: 'no-repeat',  // 不重复
                    aspectRatio: 'center' // 居中对齐
                },
                borderColor: 'rgba(0, 0, 0, 0.2)'
            },
        },
    ],
};
let mycharts:echarts.ECharts

const initEcharts = () => {
    mycharts = echarts.init(bar.value)
    echarts.registerMap('china', <any>china);
      console.log(option);
      mycharts.setOption(option, true);
}
onMounted(() => {
    getProvicne(cityCode.value)
})
onUnmounted(() => {
    mycharts.dispose;
});

const getProvicne = (provinceAlphabet: any) => {
    let path = `https://geo.datav.aliyun.com/areas_v3/bound/${provinceAlphabet}_full.json`;
     axios.get(path).then((res) => {
        echarts.registerMap('mapname', res.data);
        changeOptions("mapname");
        initEcharts()
    });


}
const changeOptions = (mapname: any) => {
  option = {
    series: [
            {
                type: "map",
                map: mapname,
                itemStyle: {
                    color: {
                        image: imageUrl,
                        repeat: 'no-repeat',
                        aspectRatio: 'center'
                    },
                    borderColor: 'rgba(0, 0, 0, 0.2)'
                },
            },
        ],
    }
}


</script>
<style lang="scss" scoped>
.box {
    height: 100%;

    .charts {
        height: 100%;
    }

}
</style>