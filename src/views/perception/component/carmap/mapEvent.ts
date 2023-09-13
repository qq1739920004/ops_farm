import {chartContainerList,chartList,width,height,marginTop} from './setMarker'

export function mapEvent(map:any){
  map.value.on('zoomend',()=>{
    let zoomV= map.value.getZoom()
    zoomV=(zoomV/7.76).toFixed(2)
    chartContainerList.value.forEach((item:any)=>{
      item.style.width = `${width.value*zoomV}px`;
      item.style.height = `${height.value*zoomV}px`;
      item.style.marginTop = `-${marginTop.value*zoomV}px`;
    })
    chartList.value.forEach((item:any)=>{
      item.resize()
    })
  })
}