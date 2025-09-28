<template>
    <div class="box">
        <div class="title">
            <span>|</span>&nbsp
            <span class="arrows-shadow">▸</span>
            {{$t('perception.statisticThisYear')}}
            <span class="arrows-shadow">◂</span>
        </div>

        <div class="charts" id="myChart">
            <div class="chart_today" >
                {{Math.trunc(todayArea)  }}
            </div>
            <div class="chart_year" ref="bar2">
                {{numPurify(Math.trunc(totalArea))  }}
            </div>
            
        </div>
        <div class="charts_title">
            <div>
                {{$t('perception.todayWorkingAreaMu')}}
            </div>
            <div>
                {{$t('perception.WanMu')}}
            </div>
        </div>

    </div>
</template>
    
<script setup lang='ts'>
function numPurify(value:number){
  let tempV:Array<string | number>=(value/10000+'').split('.')
  if(tempV[0]==0){
    return value/10000
  }else{
    return (value/10000+'').split('.')[0]
  }
}
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
    margin: 0px calc(10 / 1920 * 100vw) calc(10 / 937 * 100vh) calc(15 / 1920 * 100vw);

    .title {
        height: calc(40 / 937 * 100vh);
        line-height: calc(27 / 937 * 100vh);

        background: linear-gradient(to right, rgba(31, 61, 43, 1), rgba(48, 117, 76, 0));
        border: calc(0.8 / 1920 * 100vw) solid;
        border-image: linear-gradient(to right, rgb(63, 255, 140, 0.8), rgba(48, 117, 76, 0)) 1;
        border-left-style: none;
        border-right-style: none;

        span {
            font-size: 1.25rem; /* 20px 转换为 rem */
        }

        span:first-child {
            font-size: 1.875rem; /* 30px 转换为 rem */
            font-weight: 900;
        }
    }

    .charts {
        font-family: 'perceptionFont';
        height: calc(100% - calc(80 / 937 * 100vh));
        display: flex;
        >div {
            background-color: rgba(196, 204, 158, 0.8);
            flex: 1;
            background: url(@/assets/perceptionImage/year_bg.png) no-repeat 0;
            background-size: cover;
            display: flex;
            justify-content: center;
            align-items: center;
            background-position: center;
            background-size: 120%;
            font-size: 1.875rem; /* 30px 转换为 rem */
        }
    }
    .charts_title{
        height: calc(30 / 937 * 100vh); 
        display: flex;
        justify-content: center;
        >div{
            width: 50%;
            text-align: center;
            font-size: 1.125rem; /* 18px 转换为 rem */
        }
    }
}
</style>