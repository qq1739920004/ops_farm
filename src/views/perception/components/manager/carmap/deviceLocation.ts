import type { MonitorObj } from "@/api/perception/type";
import { ref,shallowRef } from 'vue';
import AG302 from "@/assets/icons/AG302.svg";
import AG302_warn from "@/assets/icons/AG302_warn.svg";
import AG360 from "@/assets/icons/AG360.svg";
import AG360_warn from "@/assets/icons/AG360_warn.svg";
import AG501 from "@/assets/icons/AG501.svg";
import AG501_warn from "@/assets/icons/AG501_warn.svg";
import AG501Pro from "@/assets/icons/AG501Pro.svg";
import AG501Pro_warn from "@/assets/icons/AG501Pro_warn.svg";
import AG502 from "@/assets/icons/AG502.svg";
import AG502_warn from "@/assets/icons/AG502_warn.svg";
import AG302Android from "@/assets/icons/AG302Android.svg";
import AG302Android_warn from "@/assets/icons/AG302Android_warn.svg";
import MC100 from "@/assets/icons/MC100.svg";
import MC100_warn from "@/assets/icons/MC100_warn.svg";
import AGunknown from "@/assets/icons/AGunknown.svg";
import AGunknown_warn from "@/assets/icons/AGunknown_warn.svg";
import {
  onlineFarmMachinePosition_API,
} from "@/api/monitoring";
import type { onlineMaker } from "@/api/perception/type";
const deviceList=ref<Map<string,onlineMaker>>(new Map())
const deviceMarkers=ref<Map<string,onlineMaker>>(new Map())

let AMap:any
let map:any
function starDeviceLocation(myAMap:any,mymap:any){
  if(deviceMarkers.value.size>0) {
    return deviceMarkerCenter()
  }
  AMap=myAMap
  map=mymap
  getOnlineFarmPosition()
}
// 更新设备标记的位置
function updateDeviceMarker(item:onlineMaker) {
    item.markerId = item.sn;
    item.markerLng = item.posY;
    item.markerLat = item.posX;
    item.markerType = createMarkerType(item);
    item.markerIcon = createMarkerIcon(item);
    //online是更新位置，offline是下线，upline是上线
    if(item.action=="online"){
      const tempMarker=deviceMarkers.value.get(item.sn)
      if(tempMarker){
        tempMarker.setPosition(new AMap.LngLat(item.markerLng, item.markerLat));
      }
    }else if(item.action=="offline"){
      const tempMarker=deviceMarkers.value.get(item.sn)
      if(tempMarker){
        tempMarker.setMap(null)
        deviceMarkers.value.delete(item.sn)
      }
    }else if(item.action=="upline"){
      const marker= newMarker(item)
      deviceMarkers.value.set(item.sn,marker)
    }
}
// 初始化获取设备数据
async function getOnlineFarmPosition() {
  const { data } = await onlineFarmMachinePosition_API({});
  let onlineFarmMachines:onlineMaker[] = data.onlineFarmMachines;
  onlineFarmMachines.forEach((item: onlineMaker) => {
    item.markerId = item.sn;
    item.markerLng = item.posY;
    item.markerLat = item.posX;
    item.markerType = createMarkerType(item);
    item.markerIcon = createMarkerIcon(item);
    // item.markerPopup = createMarkerPopup(item);
  });
  onlineFarmMachines = onlineFarmMachines.filter(
    (item: any) => item.markerLng || item.markerLng == 0
  );
  onlineFarmMachines.forEach((item: onlineMaker) => {
    deviceList.value.set(item.sn, item);
  })
  deviceList.value.forEach((item: onlineMaker) => {
    // updateDeviceMarker(item)
    const marker= newMarker(item)
    deviceMarkers.value.set(item.sn,marker)
  })
}
//清除设备标记
function clearDeviceMarker(){
  deviceMarkers.value.forEach((item:onlineMaker)=>{
    item.setMap(null)
  })
}
//设备标记回到地图中心
function deviceMarkerCenter(){
  deviceMarkers.value.forEach((item:onlineMaker)=>{
    item.setMap(map.value)
  })
}
function newMarker(item:onlineMaker){
  return new AMap.Marker({
    position: new AMap.LngLat(item.markerLng,item.markerLat),
    map: map.value,
    title:item.sn,
    icon: new AMap.Icon({
      size: new AMap.Size(50, 50), // 图标大小
      image: item.markerIcon, // 使用Data URI
      imageSize: new AMap.Size(50, 50) // 图标所用图片大小
  })
});
}
// marker 图标
function createMarkerIcon(item: any) {
  const { terminalType, driveState } = item;
  let icon: string = "";
  if (terminalType.includes("AG360")) {
    icon = driveState == 0 ? AG360_warn : AG360;
  } else if (terminalType.includes("AG501") && terminalType != "AG501Pro") {
    icon = driveState == 0 ? AG501_warn : AG501;
  } else if (terminalType == "AG501Pro") {
    icon = driveState == 0 ? AG501Pro_warn : AG501Pro;
  } else if (terminalType.includes("AG502")) {
    icon = driveState == 0 ? AG502_warn : AG502;
  } else if (terminalType.includes("AG302") && terminalType != "AG302Android") {
    icon = driveState == 0 ? AG302_warn : AG302;
  } else if (terminalType == "AG302Android") {
    icon = driveState == 0 ? AG302Android_warn : AG302Android;
  } else if (item.terminalType.includes("MC100")) {
    icon = driveState == 0 ? MC100_warn : MC100;
  } else {
    icon = driveState == 0 ? AGunknown_warn : AGunknown;
  }

  return icon;
}


function createMarkerType(item: any) {
  if (item.terminalType.includes("AG360")) {
    return "AG360";
  } else if (
    item.terminalType.includes("AG501") &&
    item.terminalType != "AG501Pro"
  ) {
    return "AG501";
  } else if (item.terminalType == "AG501Pro") {
    return "AG501Pro";
  } else if (item.terminalType.includes("AG502")) {
    return "AG502";
  } else if (
    item.terminalType.includes("AG302") &&
    item.terminalType != "AG302Android"
  ) {
    return "AG302";
  } else if (item.terminalType == "AG302Android") {
    return "AG302Android";
  } else if (item.terminalType.includes("MC100")) {
    return "MC100";
  } else {
    return "";
  }
}

export {createMarkerType,createMarkerIcon,starDeviceLocation,updateDeviceMarker,deviceList,deviceMarkerCenter,clearDeviceMarker}