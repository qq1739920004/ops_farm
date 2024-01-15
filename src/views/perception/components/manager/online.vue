<template>
  <div class="box">
    <div class="title">
      <span>|</span>&nbsp
      <span class="arrows-shadow">▸</span>
      {{$t('perception.numberOfAgriculturalMachineryOnline')}}
      <span class="arrows-shadow">◂</span>
    </div>

    <div class="charts" ref="bar"></div>
  </div>
</template>

<script setup lang="ts">
import * as echarts from "echarts";
import { ref, watch, onMounted, onUnmounted } from "vue";
let barimg =
  "image://data:image/png;base64,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";
let chartIcon = `data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGwAAABsCAYAAACPZlfNAAAAAXNSR0IArs4c6QAAAARzQklUCAgICHwIZIgAAAjnSURBVHic7Z09qzVJEcd/c85qqt9AVhNTwUhwQdjQWMTIL6CB4BcwWATBSNHVxRcEX0Aj33KRDU2U1UAzUZaNFjZQ8LnH4GzfW6dOVXXNTPfMPA/9h6F7ema6e/o3VV3zcu+BoaGhoaGhoaGhoaGhoaGhoaGhoaGhoaGhoaGhoYNo2rsDNV0ul+Z9nKbp0rrOrXQ4YD0AZfS8QDwEsL0geToyvF0HagGoFv2dBeNo8HYBNgPUFv1LATkKuM2BJWFF+/S2siqYPeFtCiwBy9ruHTO370sgucfsBW0zYBVYGVBrwVkDvKbs2vjG4DYBFsCqgcpAawls7vpTJzYC1x3YDFgeqLkAq11K5Odsu+1QZ3Bdga2EpdMob63fdCVYt/JLoD51pCO0PYB5A11La2Xpbhl5L62V6fyNeoDrBiwBK2NVU2WbVVfYLSO/NrXqfupYY2hHAFaDNBde2C0jfwnyUVlU541aQusCbCEsna+tW/Xo/GOXjLwGkgE4x4XeqBW0l1pUktASWBG4CF6kCIS3HtU1qRSVf9r5cplaQNsKWNESWLXFqteTB8Yrq8HbHFpzYIY7zIT2HoxTsC0C53aPHBy5PCTqTENbqy0tbI5VnZx8BFG2ofPRvCXBWGUno9xTFdpaK+sNLLK2Giyd1kCi8lo1WBP34FD7eNKAukHbK+jwwHmwTsG2jGu0gg0JRsKaxDa4t7QaOAtaM+3hEuV65BpP3IOywJW8VWeRZV0SwIlbK5u4hYexrycLVjMr6wnMck2Z4OFUWTyLi6zMc4ca1mTki+S+Gpp0f3q9aRCyhYVFkdtaeB40q90MLAuUlD5Gn6NlVU1d45ZzmDePZQGdK9stK5PyosIHtTyr1FVgSSvz2rPG4bF8iVtsBmzGtxrevOWF7xKWhHYGPg783TkekeoAQqYakO6nJ2llnoWVsmZWdqrvskieW7K2Z12hhFaWDwK/BD7D9eLLLB8Q+bPadhZpZNWZubiLtn40BTZMC5YFTsIq+7wMfAP4A/Bj4B/Yg6bdoeUKdb/08SWVF7qOLuW+lpWtcotbBR2eq8oGHGdjOXE7uK+8v/wc+BXwrupHBEzCesa9rBtpz6oscM3UyyVGsmCV9UxUqF2k1ue5QvssORd5Vnl5QdRuKaKL0Trn1doDGMTBRzSXaSvzBuIMfBn4NvBJ6rAs6/XAeUFSdE7yvGEFwJ7AMldaBM2bx+Rg1k78ZeBrwFeBj3APx7MqL+8FHvJ8ugUcsK2FzZ2/vADkrMoz+jTwLeALwIfw50Sdz7jByJKs87/TnD8K6Q3McwHeVZl1jWVA517NnwN+BLzKveXMvTGvucAu1rb1HFYDV9KaS5xrYVJn4EvAN4FPYFuVZ1k1cN55HTroyHauZlXgD9AaYEUf5XZ+sy6QjAv00poW9X0LC7OuPq+zkcV5V/havQJ8B/gi8GGj/jlzVaY/q/q8V1hf5E3O2fmipeT9WwZUba5qPn/BPlGit6120rV5o4VeAr4C/AD4lNOmZ2FdAGntbWGQG4AoGuuhj3F9Pvl1rvOb1iZwLO3x8Lelmj+rE/op8BPgnY5tzNYRgF1m5K0vnlrrTeCHwF+B/zn79LxQQm0JTD7FtrbVynsP0r+B14E/8gRqzgWyCcS9LSyyKOvTNOs1fwt9H/g18F/qcKy+bKY9gNUGwwJnLS1g/Z7ru7O3uVqV9fWvZWG6/9b5ZLzGbPUApl2f5wq9KzUCJJcT9svGjN7iGlD87f06Sp1WOzWAnmfooq0tzIKpt2cWOZhz9B/gu1znKeszAQtUBE732zsvS4vA9gQmv2uoBRxZqyrLJPJZ/QL4HfCeOPaZWB64tTYLXM1NRhdgE+0RJUYnq2GduAdXPksrA13Tm1xh/dOpy8rXLK5mbWDDW629o0SIYT0Y+QILYgv7F/AG8CejHW1hWWtbGpSEOtpXU1JzrMwDJR9NecBe5xoByhtfz9U+c5aMtc2FtdrK9grrLWiepWlQ0g1ql/hb4GdcHyfpOTOaGz1oGl7kFlFpNH8tBrcFMNm5SZTpaFFD0ouGcxFlfwG+B/wZ/+GwbqMc7wUgNQvLRI/WGKxSL2BeVKgjR8+iInCyrgfgNeA32C84ddsamBV46DnNgzXXuppAa/aaIPhjdO+dUvQ5tk6tsnK8/g5Dv1yE+8HUVmJFi14aWVxmbrsBt9tfr0zTdKl8rqVdozeXPYh9ZGrVV97nlQCl9q7MA7YkzM9GjE3V1CUqaNItWnOWTmvgpHQkWaLJCJjXRmaxAo8MnNC6lmiroKP2WkVDkrLmIgnKmu+84yxgWXAacta6XEhH+xtnS1YHZZBRAGh4ejAmtZ/3sY5uN7IyDc5bt4BHc1Z07rN1hBeY+mosoE7cgyv7yG1y7oK6SwR/4C042cDCsqqm1gXbAdPzWbRfSfUcpq1LPu2ouUNdt2clFizPmuQ6qm59nk2sC/oD01ZVAyctQA++TCWwDCxZvzVv1gDOAeWd06OO/K+LpDQsC1xxcXpd3lB793WZ24CSanCRq8vcX2mramZRWl2+r6vcROvUmn+spxY1SLJNK0KU+SgIyS5WXVZbNzrcv9+rSM9BpQxRXuQ9mvJAZeYvmfcGPwPIg9QVFnSyMAitTOajwY8ARRbrdknlPStZCqk7LNg/rM+chJy3ZB4jxVjXbVgDPTev6w1htVQ3C4O0lcm8B6NmUdnz8FxjSbNW5AUX3SyraM+vpqy8d3LaOvX+cy68yEKWuj2z38/VDw2AaWFWu56leWVRNKjLogtAb59bFrbR6+c8ugKDNDS9XoMTHet2JVifm7fWrx15nn8sp6jxLxxZ61G5NYBZeJn1p8Y3+EmqTYDBLGhW2RKLCruTKDsUqMe2tmoIQmiQA+eVLerOirJHvZC/0Ce18Hcwo/I1qgUlrl7438CUavBLs3P2gfwNer3BnX8eeBdgRQf4Pef04O8NqmhXYDALmqfa8YsH+iiQpHYHJtUA3modEZLU7gPkaSt4RwekdVhgltZAfN7ADA0NDQ0NDQ0NDQ0NDQ0NDb34+j/VZH2saM3mNAAAAABJRU5ErkJggg==`;

let bar = ref();
let mycharts: any;
const props = defineProps({
  typeCounts: {
    type: Object,
  },
});

let dataList = [
  {
    typeName: "car",
    onlineCount: 0,
    totalCount: 0,
  },
];
dataList = JSON.parse(JSON.stringify(props.typeCounts));
let yAxisData :string[]=[]
let xAxisData :number[]=[]
let seriesData:number[]=[]
let seriesDataO:{value:number,symbol:string}[]=[]
dataList.forEach(r=>{
  yAxisData.push(r.typeName)
  xAxisData.push(r.onlineCount)
  seriesData.push(r.totalCount)
  seriesDataO.push({value:r.onlineCount,symbol:barimg})
})
const option = {
  tooltip: {
            show: true, // 显示提示框,
            trigger: 'axis', // 'axis' 表示与坐标轴触发，适用于柱状图、折线图等
            renderMode: 'html',
            boxWidth: 400,
        },
  backgroundColor: "",
  grid: {
    containLabel: true,
    bottom: "5%",
    top: "5%",
    left: "8%", // 增加这个值，从而减少第二个yAxis的宽度
    right: "5%",
  },
  xAxis: {
    type: "value",
    axisLabel: {
      show:false,
      color: "#fff",
    },
    splitLine: {
      show: true,
      lineStyle: {
        color: "rgba(21, 200, 221,0.2)",
      },
    },
    data: xAxisData,
  },
  yAxis: [
    {
      type: "category",
      axisLabel: {
        interval: 0, //强制显示所有标签
        formatter: function (value: any) {
          // 动态计算 rank 标签的 left 位置，确保不与 title 冲突
          // 如果 leftPosition 与 title 冲突，向右偏移
          // if (leftPosition.value < titleWidth.value) {
          //   leftPosition.value = titleWidth.value + 5; // 在 title 宽度的右侧再添加 5 像素的间距
          // }
          //如果value大于6，截取前6个字符，后面加...
          if (value.length > 5) {
            value = value.substring(0, 5) + "...";
          }
          return "{rank|}{title|" + value + "}";
        },
        rich: {
          rank: {
            width: 26,
            height: 26,
            align: "left",
            backgroundColor: {
              image: chartIcon,
            },
            borderRadius: 20,
          },
          title: {
            fontFamily: "perceptionFont",
            color: "#43cf7c",
            fontSize: '1.35rem',
            align: "left",
            width:90
          },
        },
      },
      axisLine: {
        show: false,
      },
      splitLine: {
        show: false,
      },
      axisTick: {
        show: false,
      },
      data: yAxisData,
    },
    {
      axisLine: {
        show: false,
      },
      type: "category",
      axisTick: {
        show: false,
      },
      inverse: false,
      data: seriesData,
      axisLabel: {
        color: "#43cf7c",
        fontFamily: "perceptionFont",

        fontSize: '1.25rem',

      },
    },
  ],
  series: [
    {
      name:'在线数',
      type: "pictorialBar",
      symbol: "path://M1 1,L140 1,L140 15,L1 15,Z",
      symbolKeepAspect: false,
      stack: "triangle",
      barWidth: 16,
      itemStyle: {
        borderWidth: 0,
        color: "#43cf7c",
      },
      label: {
        fontFamily: "perceptionFont",
        show: true,
        position: "inside",//
        color: "#f5fff5",
        fontSize: '1rem',

        // offset: [15, -5],
        formatter: "{c}",
      },
      data: seriesDataO,
    },
  ],
};

const initEcharts = () => {
  mycharts = echarts.init(bar.value);
  mycharts.setOption(option);
};

onMounted(() => {
  initEcharts();
  window.addEventListener('resize', () => {
    mycharts.resize();
  });
});

watch(props, (newValue) => {
  dataList = JSON.parse(JSON.stringify(newValue.typeCounts));
  let yAxisData :string[]=[]
let xAxisData :number[]=[]
let seriesData:number[]=[]
let seriesDataO:{value:number,symbol:string}[]=[]
dataList.forEach(r=>{
  yAxisData.push(r.typeName)
  xAxisData.push(r.onlineCount)
  seriesData.push(r.totalCount)
  seriesDataO.push({value:r.onlineCount,symbol:barimg})
})
  option.yAxis[0].data = yAxisData;
  option.yAxis[1].data = seriesData;
  option.xAxis.data = xAxisData;
  option.series[0].data = seriesDataO;
  mycharts.setOption(option);
});

onUnmounted(() => {
  window.removeEventListener('resize', () => {
    mycharts.resize();
  });
  mycharts.dispose;
});
</script>
<style lang="scss" scoped>
.box {

  background: url(@/assets/perceptionImage/border_green.png) no-repeat;
  background-size: 100% 100%;
  margin: 0px 10px 30px 15px;

  .title {
    height: 40px;
    line-height: 27px;

    background: linear-gradient(
      to right,
      rgba(31, 61, 43, 1),
      rgba(48, 117, 76, 0)
    );
    border: 0.8px solid;
    border-image: linear-gradient(
        to right,
        rgb(63, 255, 140, 0.8),
        rgba(48, 117, 76, 0)
      )
      1;
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
    height: calc(100% - 40px);
  }
}
</style>
