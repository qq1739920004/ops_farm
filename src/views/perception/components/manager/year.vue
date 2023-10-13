<template>
    <div class="box">
        <div class="title">
            <span>|</span>&nbsp
            <span class="arrows-shadow">▸</span>
            当年统计数
            <span class="arrows-shadow">◂</span>
        </div>

        <div class="charts" id="myChart">
            <div class="chart_today" >
                {{Math.trunc(todayArea)  }}
            </div>
            <div class="chart_year" ref="bar2">
                {{Math.trunc(totalArea)  }}
            </div>
            
        </div>
        <div class="charts_title">
            <div>
                今日作业面积
            </div>
            <div>
                当年累计作业面积
            </div>
        </div>

    </div>
</template>
    
<script setup lang='ts'>
 defineProps({
    totalArea: {
        type: Number,
        default: 0,
    },
    todayArea: {
        type: Number,
        default: 0,
    },
});







</script>
<style lang="scss" scoped>
.box {
    background: url(@/assets/perceptionImage/border_green.png) no-repeat;
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

    .charts {
        font-family: 'perceptionFont';
        height: calc(100% - 80px);
        display: flex;
        >div {
            background-color:  rgba(196, 204, 158, 0.8);
            flex:1;
            background:url(@/assets/perceptionImage/year_bg.png) no-repeat 0;
            background-size:cover;      
            display: flex;  
            justify-content: center;  
            align-items: center; 
            font-size: 30px;
        }
    }
.charts_title{
    height: 30px; 
    display: flex;
    justify-content: center;
    >div{
        width: 50%;
        text-align: center;
        font-size: 18px;
    }
}
}
</style>