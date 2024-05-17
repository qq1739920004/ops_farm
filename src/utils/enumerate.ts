
export const voltage:any={
    0: 'any.voltage0',	
    1: 'any.voltage1',
    2: 'any.voltage2',
    3: 'any.voltage3',
}
export const commumode:any = {
    1:'any.commumode1',	
    2: 'any.commumode2',	
    3: 'any.commumode3',	                    
}
export const netSignalIcon:any = {
    1: 'netSignal1',
    2: 'netSignal2',
    3: 'netSignal3',
    4: 'netSignal4',
    5: 'netSignal5',
}
export const netSignalTxt:any = {
    1: 'any.netSignal1',
    2: 'any.netSignal2',
    3: 'any.netSignal3',
    4: 'any.netSignal4',
    5:'any.netSignal5',
}
export const ownership:any={
    0:'any.ownership0',
    1:'any.ownership1',
}
export const serverType:any={
    '0':'any.serverType0',
    '1':'any.serverType1',
    '2':'any.serverType2',
    '3':'any.serverType3',
    '5':'any.serverType5',
    '9':'any.serverType9',
    "-1":'any.serverTypeN1',
    "-2":'any.serverTypeN2',
}
export const startModel:any={
    0:'any.startModel0',
    1:'any.startModel1',
    2:'any.startModel2',
}
export const health:any={
    0:'any.health0',
      1:'any.health1',
      2:'any.health2',
      3:'any.health3',
      4:'any.health4',
      5:'any.health5',
      6:'any.health6',
      7:'any.health7',
      8:'any.health8',
}
export const stationtype:any={
	0:'RTCM23',
	1:'OEM4',
	2:'RTCM31',
	3:'BINEX',
	5:'RT27',
	7:'SOUTH',
	8:'RTCM32',
}
export const dateTabType:any={
    0:'messages.all',//全部
    1:'any.dateTabType1',//过去一个月
    2:'any.dateTabType2',//今日
    3:'any.dateTabType3',//本月
    
}
export const chargeType:any={
    0:'any.chargeType0',
    1:'any.chargeType1',
    2:'any.chargeType2',
}
export const level:any={
    1:'any.level1',
    2:'any.level2',
    3:'any.level3'
}

export const sourceType:any={
    1:'手动发送',
    2:'系统自动发送'
}
export const statisticsType:any={
    'duration':'any.chargeType2',
    'dataTraffic':'any.chargeType1',
    'dataPackets':'any.dataStatictics2',
    'epoch':'netWorkM.epoch',
    'averageSatNum':'any.dataStatictics4',
    'minSatNum':'any.dataStatictics5',
    'averageDelay':'any.dataStatictics6',
    'maxDelay':'any.dataStatictics7',
}
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
import wifi_0 from "@/assets/monitoring/wifi_0.png";
import wifi_1 from "@/assets/monitoring/wifi_1.png";
import wifi_2 from "@/assets/monitoring/wifi_2.png";
import wifi_3 from "@/assets/monitoring/wifi_3.png";
import wifi_4 from "@/assets/monitoring/wifi_4.png";

import green from "@/assets/monitoring/green.svg";
import yellow from "@/assets/monitoring/yellow.svg";
export const markerTypeIcon:any={
    'base_1':AG302,
    'base_2':station_online_2,
    'base_3':station_online_3,
    'base_0':station_offline,
    'user_0':person_noFixed,
    'user_1':person_fixed
}
export const markerTypeIconSmall:any={
    'base_1':green,
    'base_2':green,
    'base_3':green,
    'base_0':grey,
    'user_0':red,
    'user_1':blue
}
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
