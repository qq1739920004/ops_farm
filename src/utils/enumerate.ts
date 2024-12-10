
export const voltage:any = {
    0: 'enumerate.voltage0',
    1: 'enumerate.voltage1',
    2: 'enumerate.voltage2',
    3: 'enumerate.voltage3',
}
export const commumode:any = {
    1: 'enumerate.commumode1',
    2: 'enumerate.commumode2',
    3: 'enumerate.commumode3',
}
export const netSignalIcon:any = {
    1: 'netSignal1',
    2: 'netSignal2',
    3: 'netSignal3',
    4: 'netSignal4',
    5: 'netSignal5',
}
export const netSignalTxt:any = {
    1: 'enumerate.netSignal1',
    2: 'enumerate.netSignal2',
    3: 'enumerate.netSignal3',
    4: 'enumerate.netSignal4',
    5: 'enumerate.netSignal5',
}
export const ownership:any = {
    0: 'enumerate.ownership0',
    1: 'enumerate.ownership1',
}
export const serverType:any = {
    '0': 'enumerate.serverType0',
    '1': 'enumerate.serverType1',
    '2': 'enumerate.serverType2',
    '3': 'enumerate.serverType3',
    '5': 'enumerate.serverType5',
    '9': 'enumerate.serverType9',
    "-1": 'enumerate.serverTypeN1',
    "-2": 'enumerate.serverTypeN2',
}
export const startModel:any = {
    0: 'enumerate.startModel0',
    1: 'enumerate.startModel1',
    2: 'enumerate.startModel2',
}
export const health:any = {
    0: 'enumerate.health0',
    1: 'enumerate.health1',
    2: 'enumerate.health2',
    3: 'enumerate.health3',
    4: 'enumerate.health4',
    5: 'enumerate.health5',
    6: 'enumerate.health6',
    7: 'enumerate.health7',
    8: 'enumerate.health8',
}
export const stationtype:any = {
    0: 'RTCM23',
    1: 'OEM4',
    2: 'RTCM31',
    3: 'BINEX',
    5: 'RT27',
    7: 'SOUTH',
    8: 'RTCM32',
    9: 'CNC'
}
export const dateTabType:any = {
    0: 'messages.all',//全部
    1: 'enumerate.dateTabType1',//过去一个月
    2: 'enumerate.dateTabType2',//今日
    3: 'enumerate.dateTabType3',//本月

}
export const chargeType:any = {
    0: 'enumerate.chargeType0',
    1: 'enumerate.chargeType1',
    2: 'enumerate.chargeType2',
}
export const level:any = {
    1: 'enumerate.level1',
    2: 'enumerate.level2',
    3: 'enumerate.level3'
}

export const sourceType:any = {
    1: '手动发送',
    2: '系统自动发送'
}
export const statisticsType:any = {
    'duration': 'enumerate.chargeType2',
    'dataTraffic': 'enumerate.chargeType1',
    'dataPackets': 'enumerate.dataStatictics2',
    'epoch': 'netWorkM.epoch',
    'averSatNum': 'enumerate.dataStatictics4',
    'minSatNum': 'enumerate.dataStatictics5',
    'averageDelay': 'enumerate.dataStatictics6',
    'maxDelay': 'enumerate.dataStatictics7',
    'gpsWeek': 'enumerate.gpsWeek',
    'gpsSecond': 'enumerate.gpsSecond',
    'maxDiff': 'enumerate.maxDiff',
    'recvEpoch': 'enumerate.recvEpoch',
    'trop95': 'enumerate.trop95',
    'ion95': 'enumerate.ion95',
    'averageDiff': 'enumerate.averageDiff',
    'vrsepoch': 'enumerate.recvEpoch',

}
export const statisticsType1:any = {
    'duration': 'enumerate.chargeType2',
    'datatraffic': 'enumerate.chargeType1',
    'datapackets': 'enumerate.dataStatictics2',
    'epoch': 'netWorkM.epoch',
    'averagesatnum': 'enumerate.dataStatictics4',
    'minsatnum': 'enumerate.dataStatictics5',
    'averagedelay': 'enumerate.dataStatictics6',
    'maxdelay': 'enumerate.dataStatictics7',
    'gpsweek': 'enumerate.gpsWeek',
    'gpssecond': 'enumerate.gpsSecond',
    'maxdiff': 'enumerate.maxDiff',
    'recvepoch': 'enumerate.recvEpoch',
    'trop95': 'enumerate.trop95',
    'ion95': 'enumerate.ion95',
    'averagediff': 'enumerate.averageDiff',
    'vrsepoch': 'enumerate.recvEpoch',

}
import station_online_1 from "@/assets/realtime-monitor/station_online_1.png";
import station_online_2 from "@/assets/realtime-monitor/station_online_2.png";
import station_online_3 from "@/assets/realtime-monitor/station_online_3.png";
import station_offline from "@/assets/realtime-monitor/station_offline.png";
import person_fixed from "@/assets/realtime-monitor/person_fixed.png";
import person_noFixed from "@/assets/realtime-monitor/person_noFixed.png";
import red from "@/assets/realtime-monitor/red.svg";
import blue from "@/assets/realtime-monitor/blue.svg";
import green from "@/assets/realtime-monitor/green.svg";
import grey from "@/assets/realtime-monitor/grey.svg";
export const markerTypeIcon:any = {
    'base_1': station_online_1,
    'base_2': station_online_2,
    'base_3': station_online_3,
    'base_0': station_offline,
    'user_0': person_noFixed,
    'user_1': person_fixed
}
export const markerTypeIconSmall:any = {
    'base_1': green,
    'base_2': green,
    'base_3': green,
    'base_0': grey,
    'user_0': red,
    'user_1': blue
}
import wifi_0 from "@/assets/realtime-monitor/wifi_0.png";
import wifi_1 from "@/assets/realtime-monitor/wifi_1.png";
import wifi_2 from "@/assets/realtime-monitor/wifi_2.png";
import wifi_3 from "@/assets/realtime-monitor/wifi_3.png";
import wifi_4 from "@/assets/realtime-monitor/wifi_4.png";
import wifi_5 from "@/assets/realtime-monitor/wifi_5.png";
export const netSignalImg:any = {
    0: wifi_0,
    1: wifi_1,
    2: wifi_2,
    3: wifi_3,
    4: wifi_4,
    5: wifi_5,
};
export const appId: number = 1711933450927;
export const mapGeo:any[]=[
    {
        top:'10%',
        zlevel:5,
        borderColor: '#fff',
        areaColor: '#030b21',
        borderWidth:1.5,
    },
    {
        top:'12%',
        zlevel:4,
        borderColor: '#409eff',
        areaColor: 'rgba(255,255,255,0.5)',
        borderWidth:2,
    },
    // {
    //     top:'12%',
    //     zlevel:3,
    //     borderColor: 'rgba(255,255,255,0.23)',
    //     areaColor: 'rgba(255,255,255,0.23)',
    //     borderWidth:1,
    // },
    // {
    //     top:'13%',
    //     zlevel:2,
    //     borderColor:'rgba(255,255,255,0.2)',
    //     areaColor: 'rgba(255,255,255,0.2)',
    //     borderWidth:1,
    // }
]
export const reportColorList=['#0080FF','#00FFCC','#EA00FF','#FFA600','#FF0000','#45FFA2','#0015FF']
export const monthList:any={
    1:'January',
    2:'February',
    3:'March',
    4:'April',
    5:'May',
    6:'June',
    7:'July',
    8:'August',
    9:'September',
    10:'October',
    11:'November',
    12:'December'
}

