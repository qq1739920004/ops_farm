<template>
    <div class="box">
        <div class="title">
            <span>|</span>&nbsp
            <span>▸</span>
            当年统计数
            <span>◂</span>
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
                今年作业面积
            </div>
            <div>
                今年累计作业面积
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

    .charts {
        height: calc(100% - 80px);
        display: flex;
     
        >div {
            background-color:  rgba(196, 204, 158, 0.8);
           
            width: 50%;
            background:url(../image/year_bg.png) no-repeat;           
            display: flex;  
            justify-content: center;  
            align-items: center; 
           padding-right: 30px;       
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
        font-size: 20px;
        padding-right: 30px;
    }
}
}
</style>