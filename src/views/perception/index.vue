<template>
    <div class="container">
        <!-- 内容展示区 -->
        <div class="screen" ref="screen">
            <div class="top">
                <Top :monitorData ="monitorData "/>
            </div>

            <div class="bottom">
                <div class="left">
                    <Workarea class="workarea" :carArea="carArea" />
                    <Year class="year" />
                </div>

                <div class="middle">mmmm</div>
                <div class="right">right</div>
            </div>
        </div>
    </div>
</template>
  
<script setup lang='ts'>
import { ref, onMounted } from "vue";
import Top from "./component/top.vue";
import Year from "./component/year.vue";
import Workarea from "./component/workarea.vue";
import { getMonitorAPI } from '@/api/perception/index.ts'
import type { MonitorObj } from '@/api/perception/type'

let screen = ref();
onMounted(() => {
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
// 监测数据
const monitorData = ref<MonitorObj>()
// 各车辆作业面积
const carArea = ref<object>({})
const getMonitor = async () => {
    const res = await getMonitorAPI()
    monitorData.value=res.data
    carArea.value = res.data.carArea
}

getMonitor()

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
    }

    .top {
        width: 100%;
        height: 223px;
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
        }
    }
}
</style>