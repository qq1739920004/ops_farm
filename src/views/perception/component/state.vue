<template>
    <div class="box">
        <div class="title">
            <span>|</span>&nbsp
            <span class="arrows-shadow">▸</span>
            状态通知栏
            <span class="arrows-shadow">◂</span>
        </div>

        <div class="state">
            <ul>
                <li v-for="(item, index) in props.provinceCars" :key="index">

                    <div class="state_time">20210202</div>
                    <div class="state_main">
                        <span class="circle">●</span>
                        <div class="state_bar">

                            <span>{{ item.name }}</span>
                            <span>{{ item.cityName }}</span>
                            <span>
                                <el-tag type="danger" size="small" effect="dark">离线</el-tag></span>
                        </div>

                    </div>
                </li>
            </ul>
        </div>

    </div>
</template>
    
<script setup lang='ts'>

const props = defineProps({
    provinceCars: {
        type: Object
    }
})

// watch(props, (newValue) => {
//     JSON.parse(JSON.stringify(newValue.provinceCars))   
// })

</script>
<style lang="scss" scoped>
.box {
    background: url(../image/border_green.png) no-repeat;
    background-size: 100% 100%;
    margin: 0px 10px 10px 15px;

    .title {
        height: 40px;
        line-height: 27px;

        background: linear-gradient(to right, rgba(31, 61, 43, 1), rgba(48, 117, 76, 0));
        border: 0.8px solid;
        border-image: linear-gradient(to right, rgb(63, 255, 140, 0.8), rgba(48, 117, 76, 0)) 1;
        border-left-style: none;
        border-right-style: none;

        span {
            font-size: 20px;
        }

        span:first-child {
            font-size: 30px;
            font-weight: 900;
        }
    }

    .state {
        height: calc(100% - 40px);

        // background-color: rgb(233, 208, 212, 0.1);

        ul>li {
            margin-top: 10px;
            padding-top: 10px;

            height: 60px;
            font-size: 12px;
        }

        .state_time {
            padding-left: 40px;
        }

        .state_main {
            padding-left: 5px;
            // height: 40px;
            height: calc(100% - 20px);
            display: flex;


            .circle {
                padding-left: 5px;
                flex: 1;
                color: rgb(255, 12, 12, 0.5);
            }

            .state_bar {
                position: relative;

                background: url(../image/rectangle_red.png) no-repeat;
                background-size: 100% 100%;
                flex: 20;
                line-height: 30px;
                padding: 0 15px;

                span:first-child {

                    position: absolute;
                    left: 20px;
                }

                span:nth-child(2) {
                    position: absolute;
                    right: 80px;

                }

                span:nth-child(3) {
                    padding-top: 5px;
                    position: absolute;
                    right: 80px;

                }
            }
        }
    }
}</style>