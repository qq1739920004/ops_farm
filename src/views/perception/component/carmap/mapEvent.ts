import {chartContainerList,chartList,width,height,marginTop} from './setMarker'
let timer:any=null
//防抖函数
export function antiShake(){}
export function mapEvent(map:any){  
  map.value.on('zoomend',()=>{
    if(timer){
      clearTimeout(timer)
    }
    timer=setTimeout(() => {
      let zoomV= map.value.getZoom()
      zoomV=(zoomV/5.76).toFixed(2)
      chartContainerList.value.forEach((item:any)=>{
        item.style.width = `${width.value*zoomV}px`;
        item.style.height = `${height.value*zoomV}px`;
        item.style.marginTop = `-${marginTop.value*zoomV}px`;
      })
      chartList.value.forEach((item:any)=>{
        item.resize()
      })
    }, 100)
  })
}