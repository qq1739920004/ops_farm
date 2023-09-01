<template>
    <div class="container">
        <!-- 内容展示区 -->
        <div class="screen" ref="screen">
            <div class="top">
                <Top :monitorData ="monitorData "/>
            </div>

            <div class="bottom">
                <div class="left">
                    <Workarea class="workarea" :carAreas="carAreas" v-if="carAreas.length" />
                    <Year class="year" :totalArea="totalArea" :todayArea="todayArea" />
                </div>

                <div class="middle">
                    <Carmap :provinceCars="provinceCars"></Carmap>
                </div>
                <div class="right">
                    <Online class="online" v-if="typeCounts.length"  :typeCounts="typeCounts"></Online>
                    <State class="state" :provinceCars="provinceCars"></State>
                </div>
            </div>
        </div>
    </div>
</template>
  
<script setup lang='ts'>
import { ref, onMounted} from "vue";
import Top from "./component/top.vue";
import Year from "./component/year.vue";
import Carmap from "./component/carmap.vue";
import Workarea from "./component/workarea.vue";
import State from "./component/state.vue";
import Online from "./component/online.vue"
import { getMonitorAPI } from '@/api/perception/index.ts'
import type { MonitorObj } from '@/api/perception/type'
// 监测数据
const monitorData = ref<MonitorObj>()

// 各车辆作业面积
const carAreas = ref<Array<object>>([])

const todayArea=ref<number>()
const totalArea=ref<number>()
// 各类型农机在线数
const typeCounts=ref<Array<object>>([])
// 各省车辆状态
const provinceCars=ref<object>({})

const getMonitor = async () => {
    const res = await getMonitorAPI()
    monitorData.value=res.data
    carAreas.value = res.data.carAreas
    console.log(carAreas.value,'carAreas.value');
    todayArea.value=res.data.todayArea
    totalArea.value=res.data.totalArea
    typeCounts.value=res.data.typeCounts
    provinceCars.value=res.data.provinceCars
}

// 屏幕
let screen = ref();

onMounted(() => {
    getMonitor()
    screen.value.style.transform = `scale(${getScale()}) translate(-50%,-50%)`;
});
window.onresize = () => {
    screen.value.style.transform = `scale(${getScale()}) translate(-50%,-50%)`;
};
function getScale(w = 1920, h = 937) {
    const ww = window.innerWidth / w;
    const wh = window.innerHeight / h;
    return ww < wh ? ww : wh;
}


// 实时监听

</script>
  
<style lang="scss" scoped>
.container {
    height: 100vh;
    width: 100vw;
    background: url(../perception/image/scene.png),
        url(../perception/image/border.png) no-repeat;
    background-color: rgba(2, 28, 14, 1);
    background-size: cover, contain;
    background-position: center;
    color: white;

    .screen {
        width: 1920px;
        height: 937px;
        position: fixed;
        left: 50%;
        top: 50%;
        transform-origin: left top;
        .top {
          display: flex;
          justify-content: space-between;
        width: 100%;
        height: 223px;
        .top_time{
          align-self: flex-start;
        }
    }
    .bottom {
        display: flex;
        height: 714px;


        .left {
            flex: 1;
            display: flex;
            flex-direction: column;

            .workarea {
                height: 400px;
            }

            .year {
                height: 270px;
            }

        }

        .middle {
            flex: 2;
        }

        .right {
            flex: 1;
            display: flex;
            flex-direction: column;
            .online{
                height: 270px;
                
            }
            .state{
                height: 400px;
            
            }
        }
    }
    }

   

    
}
</style>