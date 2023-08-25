<!--  -->
<template>
    <div class="page7_child6_container">
        <div id="child6_map" class=""></div>
        <div class="map_selector">
            <el-select v-model="mapId" placeholder="" size="small" @change="hangleSelectChange">
                <el-option v-for="(item, index) in mapOptions" :key="index" :label="item.mapName" :value="item.mapId" />
            </el-select>
        </div>
        <div class="head_top">
            <div class="left">
                <el-button type='primary' icon="back" @click="router.go(-1)">返回</el-button>
            </div>
            <div class="right">
                <el-select v-model="pageInfo.companyId" placeholder="请选择" @blur="changeBlur1">
                    <el-option style="width: 230px;" v-for="item in dealerList" :label="item.name" :value="item.id"
                        :key="item.id"></el-option>
                </el-select>
                <el-select v-model="pageInfo.carId" placeholder="请选择" @blur="changeBlur2">
                    <el-option style="width: 200px;" v-for="item in CarDealerList" :label="item.nameNpn" :value="item.id"
                        :key="item.id"></el-option>
                </el-select>
                <div :class="isShow ? 'infiniteMenu' : 'infiniteMenu2'" v-if='paddyWorkList.length'>
                    <div class="el_icon" v-show="isShow" @click="changeisShow(false)">
                        +
                    </div>
                    <div class="el_icon" v-show="!isShow" @click="changeisShow(true)">
                        -
                    </div>
                    <ul v-infinite-scroll="load" class="infinite-list" style="overflow: auto">
                        <li v-for="(item, index) in paddyWorkList" :key="index"
                            :class="item.checked ? 'infinite-list-item' : 'infinite-list-item2'">
                            <div class="li_title">
                                作业{{ item.name }}
                            </div>
                            {{ item.workedArea }}亩
                            <el-checkbox-group v-model="ids">
                                <el-checkbox :label="item.id">
                                    <br />
                                </el-checkbox>
                            </el-checkbox-group>
                        </li>
                        <span v-if="pageInfo.pageSize >= total">作业已全部加载</span>
                    </ul>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">

import { ref, reactive, watch, onMounted } from 'vue'
import { PageObj, dealerCarObj, dealerCarResponseData, paddyWorkObj, paddyWorkListResponsenumber } from '@/api/jobManagement/type'
import { carDealerResponseData, carDealerObj } from '@/api/machineryList/type'
import { getCarDealerList_API, paddyWorkList_API } from '@/api/jobManagement/index'
import { carDealer_API } from '@/api/machineryList/index'
import { historyList_path } from '@/api/jobManagement/taskManage/index'
import router from '@/router'
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet.pm";
import "leaflet.pm/dist/leaflet.pm.css";
import { ElMessage } from 'element-plus'
import gcoord from 'gcoord'
import a from '@/assets/jobManage/a.png'
import b from '@/assets/jobManage/b.png'
// import pointInChina from '@/utils/pointInChina'
// import L from 'leaflet'
// 提交的车辆数组
const ids = ref<any>([337, 338])
const isShow = ref<boolean>(true)
// 提交数据
const pageInfo = reactive<PageObj>({
    carId: 10005,
    name: '',
    companyId: 3,
    currentPage: 1,
    pageSize: 7,
    st: '',
    et: ''
})
const total = ref<number>(0)
const CarDealerList = reactive<dealerCarObj[]>([])
const dealerList = ref<carDealerObj[]>([])
const paddyWorkList = ref<paddyWorkObj[]>([])

onMounted(() => {
    // var mymap = L.map('child6_map').setView([51.505, 13], 2);
    // L.tileLayer('http://t0.tianditu.gov.cn/img_c/wmts?tk=e09f020983748d6482cadae6def096bf&SERVICE=WMTS&REQUEST=GetTile&VERSION=1.0.0&LAYER=img&STYLE=default&TILEMATRIXSET=c&TILEMATRIX={z}&TILEROW={y}&TILECOL={x}&FORMAT=tiles', {
    //     attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="http://mapbox.com">Mapbox</a>',
    //     maxZoom: 18,
    //     id: 'mapbox.streets',
    //     accessToken: 'your.mapbox.access.token',
    //     minZoom: 0
    // }).addTo(mymap);
    initMap()
})

// 地图相关
const map = ref<any>(null)
const originPoint = ref<any>([31.172800343248, 121.406021546488])
const originZoom = ref<any>(5)
const tileLayer = reactive<any>([])
const tileUrl = reactive<any>({
    TianDiTu: {
        Normal: {
            Map: "http://t{s}.tianditu.com/DataServer?T=vec_w&X={x}&Y={y}&L={z}&tk={key}",
            Annotion: "http://t{s}.tianditu.com/DataServer?T=cva_w&X={x}&Y={y}&L={z}&tk={key}"
        },
        Satellite: {
            Map: "http://t{s}.tianditu.com/DataServer?T=img_w&X={x}&Y={y}&L={z}&tk={key}",
            Annotion: "http://t{s}.tianditu.com/DataServer?T=cia_w&X={x}&Y={y}&L={z}&tk={key}"
        },
        Terrain: {
            Map: "http://t{s}.tianditu.com/DataServer?T=ter_w&X={x}&Y={y}&L={z}&tk={key}",
            Annotion: "http://t{s}.tianditu.com/DataServer?T=cta_w&X={x}&Y={y}&L={z}&tk={key}"
        },
        Subdomains: ['0', '1', '2', '3', '4', '5', '6', '7'],
        key: "174705aebfe31b79b3587279e211cb9a"
    },

    GaoDe: {
        Normal: {
            Map: 'http://webrd0{s}.is.autonavi.com/appmaptile?lang=zh_cn&size=1&scale=1&style=8&x={x}&y={y}&z={z}'
        },
        Satellite: {
            Map: 'http://webst0{s}.is.autonavi.com/appmaptile?style=6&x={x}&y={y}&z={z}',
            Annotion: 'http://webst0{s}.is.autonavi.com/appmaptile?style=8&x={x}&y={y}&z={z}'
        },
        Subdomains: ["1", "2", "3", "4"]
    },

    Google: {
        Normal: {
            // Map: "http://www.google.cn/maps/vt?lyrs=m@189&gl=cn&x={x}&y={y}&z={z}"
            // Map: "https://mt2.google.cn/vt/lyrs=m@167000000&hl=zh-CN&gl=cn&x={x}&y={y}&z={z}&s=Galil"
            Map: 'https://mt1.google.com/vt/lyrs=r&gl=cn&x={x}&y={y}&z={z}'
        },
        Satellite: {
            // Map: "http://www.google.cn/maps/vt?lyrs=s@189&gl=cn&x={x}&y={y}&z={z}"
            // Map: "https://mt2.google.cn/maps/vt?lyrs=s%40781&hl=zh-CN&gl=CN&x={x}&y={y}&z={z}",
            // Map: "https://mt1.google.com/vt/lyrs=s&gl=cn&x={x}&y={y}&z={z}",
            // Map: "https://mt1-cdn.mapsvc.com/maps/vt?lyrs=s&gl=cn&x={x}&y={y}&z={z}",
            Map: "http://webst0{s}.is.autonavi.com/appmaptile?style=6&x={x}&y={y}&z={z}",
            Annotion: 'http://webst0{s}.is.autonavi.com/appmaptile?style=8&x={x}&y={y}&z={z}'
        },
        // Subdomains: []
        Subdomains: ["1", "2", "3", "4"]
    },

    Geoq: {
        Normal: {
            Map: "http://map.geoq.cn/ArcGIS/rest/services/ChinaOnlineCommunity/MapServer/tile/{z}/{y}/{x}",
            PurplishBlue: "http://map.geoq.cn/ArcGIS/rest/services/ChinaOnlineStreetPurplishBlue/MapServer/tile/{z}/{y}/{x}",
            Gray: "http://map.geoq.cn/ArcGIS/rest/services/ChinaOnlineStreetGray/MapServer/tile/{z}/{y}/{x}",
            Warm: "http://map.geoq.cn/ArcGIS/rest/services/ChinaOnlineStreetWarm/MapServer/tile/{z}/{y}/{x}",
        },
        Theme: {
            Hydro: "http://thematic.geoq.cn/arcgis/rest/services/ThematicMaps/WorldHydroMap/MapServer/tile/{z}/{y}/{x}"
        },
        Subdomains: []
    },

    OSM: {
        Normal: {
            Map: "http://{s}.tile.osm.org/{z}/{x}/{y}.png",
        },
        Subdomains: ['a', 'b', 'c']
    }

})
const mapId = ref(0)
const mapOptions = reactive([
    {
        mapName: '卫星地图',
        mapId: 0,
    },
    {
        mapName: '高德地图',
        mapId: 1,
    },
    // {
    //     mapName: '谷歌地图',
    //     mapId: 2
    // }
])
const markerCollect = reactive<any>({})
const initMap = (id = 0) => {
    map.value = L.map('child6_map',
        {
            // fullscreenControl: false,
            zoomControl: false,
        }
    ).setView(originPoint.value, originZoom.value)
    handleMapChange(mapId.value)
}
const handleMapChange = (mapId: any) => {
    switch (mapId) {
        case 0:
            changeTileLayer('Google', 'Satellite')
            break
        case 1:
            changeTileLayer('GaoDe', 'Normal')
            break
        case 2:
            changeTileLayer('Google', 'Normal')
            break
        case 3:
            changeTileLayer('TianDiTu', 'Normal')
            break
    }
}
const changeTileLayer = (mapName = 'Google', mapType = 'Satellite') => {
    try {
        if (!map.value) {
            console.warn('未初始化底图实例')
            return
        }
        if (tileLayer.length) {
            tileLayer.forEach((layer) => layer.remove())
            Object.assign(tileLayer, [])
        }
        let mapUrl = tileUrl[mapName][mapType]
        let options = reactive<any>({})
        options.subdomains = tileUrl[mapName]['Subdomains']
        if ('tms' in tileUrl[mapName]) {
            options.tms = tileUrl[mapName]['tms']
        }
        if ('key' in tileUrl[mapName]) {
            options.key = tileUrl[mapName]['key']
        }
        for (let key in mapUrl) {
            let layer = L.tileLayer(mapUrl[key], options).addTo(map.value)
            tileLayer.push(layer as never)
        }
    } catch (error) {
        console.log(error)
    }
}
// 更改底地图
const hangleSelectChange = () => {
    handleMapChange(mapId.value)
}
// 保存记录
const saveMarker = (workId: any, markerObj: any) => {
    try {
        markerCollect[workId]['marker'] = markerObj
    } catch (err) {
        console.log(err)
    }
}
// 画线
const loadWorkData = async (workId: any) => {
    const res = await historyList_path(workId)
    let key = Object.keys(res.data)
    let tranpatrnt = [] as any
    getMachineInfo()
    console.log(machine);
    key.forEach((item, index) => {
        if (!item.length || res.data[item] === null || !res.data[item].length) {
            ElMessage.warning(`${item}暂无作业数据`);
            return
        }
        let PointListTransed = res.data[item].map((item2: any) => {
            return coorTransform([item2.posX as never, item2.posY as never], mapId.value) // 转换坐标
        })
        tranpatrnt.push(PointListTransed)
        let line = L.polyline(PointListTransed, { color: '#00ff00' })
            .addTo(map.value)
            .bindPopup(`<div style='
    width: 241px;
    height: 289px;
    opacity: 1;
    border-radius: 4px;
    background: rgba(255, 255, 255, 1);
    position:relative
'>
<div style='width:50%;display:flex;
    justify-content: end;'><div style="position:absolute"> <svg t="1692957369421" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="6471" id="mx_n_1692957369422" width="16" height="16"><path d="M512 960c-254.784 0-384-59.904-384-178.112 0-84.416 133.12-139.648 265.856-158.336v-17.536c-79.68-58.24-118.464-159.936-118.464-309.952C275.392 150.784 362.368 64 508.096 64h7.808c145.792 0 232.768 86.784 232.768 232.064 0 56.448 0 223.808-117.568 310.144l-0.384 17.408C763.2 642.432 896 697.6 896 781.888 896 900.096 766.784 960 512 960zM508.032 120c-80.256 0-175.872 29.952-175.872 172.8 0 137.344 34.56 225.92 105.536 270.72 8.96 5.696 14.464 15.872 14.464 26.88v62.72a30.848 30.848 0 0 1-26.944 31.232c-145.728 15.232-242.368 71.232-242.368 101.568 0 97.6 179.008 118.08 329.152 118.08 150.208 0 329.152-20.48 329.152-118.08 0-30.336-96.64-86.4-242.368-101.568a30.912 30.912 0 0 1-26.88-31.936l1.28-62.72a31.744 31.744 0 0 1 14.4-26.176c71.168-44.928 104.32-130.944 104.32-270.72 0-142.848-95.68-172.8-175.936-172.8h-7.936z" fill="#4ce277" p-id="6472"></path></svg>${machine.value[index].name}</div></div>
<div style='width:50%; >sn号:${item}</div>
</div>`)
            .openPopup()
        // .bindPopup(`作业名称：${item}`)
        saveMarker(ids.value[index], [{ markerObj: line, name: 'lines' }])
    })
    map.value.fitBounds(tranpatrnt)
}
//坐标转换
const coorTransform = (point = [], mapType = 1) => {
    //经纬度顺序 gcoor 需要 [116.403988, 39.914266] 经度在前
    // if (!pointInChina(point)) {
    //     return point
    // }
    let p: any = [point[1], point[0]]
    switch (mapType) {
        case 0:
            let [a, b] = gcoord.transform(p, gcoord.WGS84, gcoord.GCJ02)
            return [b, a]
        case 1:
            let [c, d] = gcoord.transform(p, gcoord.WGS84, gcoord.GCJ02)
            return [d, c]
        case 2:
            let [e, f] = gcoord.transform(p, gcoord.WGS84, gcoord.BD09)
            return [f, e]
        case 3:
            let [g, h] = gcoord.transform(p, gcoord.WGS84, gcoord.GCJ02)
            return [h, g]
        default:
            let [i, j] = gcoord.transform(p, gcoord.WGS84, gcoord.GCJ02)
            return [j, i]
    }
}
// 地图绘制方法
const addPathAB = (item: any) => {
    try {
        let pointA = coorTransform(
            [item.lineptax as never, item.lineptay as never],
            mapId.value
        )
        let pointB = coorTransform(
            [item.lineptbx as never, item.lineptby as never],
            mapId.value
        )
        let l1 = L.latLng(item.lineptax, item.lineptay)
        let l2 = L.latLng(item.lineptbx, item.lineptby)
        let distance = l1.distanceTo(l2).toFixed(0)
        let iconA = L.icon({
            iconUrl: a,
            iconAnchor: [12, 30],
            popupAnchor: [0, -30],
        })
        let iconB = L.icon({
            iconUrl: b,
            iconAnchor: [12, 30],
            popupAnchor: [0, -30],
        })
        let markerA = L.marker(pointA as never, { icon: iconA }).addTo(map.value)
        let markerB = L.marker(pointB as never, { icon: iconB }).addTo(map.value)
        let line = L.polyline([pointA, pointB], {
            color: 'red',
            dashArray: [9, 9],
        })
            .bindTooltip(`AB点距离 ${distance} 米`, { permanent: true })
            .addTo(map.value)
        map.value.fitBounds([pointA, pointB])
        let temMarkers = [
            {
                markerObj: markerA,
                name: 'markerA',
            },
            {
                markerObj: markerB,
                name: 'markerB',
            },
            {
                markerObj: line,
                name: 'lineAB',
            },
        ]
        saveMarker(item.id, temMarkers)
        //绘制田块边界(全部上传GCJ02坐标，对应全部GCJ02地图，无需相互转换！！！)
        if (item.borderpoints) {
            let latlngs = JSON.parse(item.borderpoints)
            let polygon = L.polygon(latlngs, { color: '#388BFE' }).addTo(map)
            let tem = {
                name: 'border',
                markerObj: polygon,
            }
            saveMarker(item.id, [tem])
        }
    } catch (err) {
        console.log(err)
    }
}
// 删除区域
const removeMarker = (workId: any) => {
    try {
        if (markerCollect[workId]['marker'].length) {
            let a = markerCollect[workId]['marker']
            a.forEach((item: any) => {
                if (item.markerObj) {
                    map.value.removeLayer(item.markerObj)
                }
            })
            markerCollect[workId]['marker'] = []
        } else {
        }
    } catch (err) {
        console.log(err)
    }
}
const hasMarker = (workId: any) => {
    return markerCollect[workId]['marker'].length > 0
}
const machine = ref<any>([])
const getMachineInfo = () => {

    paddyWorkList.value.forEach((element: any) => {
        if (ids.value.includes(element.id)) {
            machine.value.push(element)
        }
    })
}
const hasMarkerField = (workId: any, field: any) => {
    let a = markerCollect[workId]['marker'].find(
        (element: any) => element.name === field
    )
    if (a && a[field] !== null) {
        return true
    } else {
        return false
    }
}
// 清除全部
const clearAllMarkers = () => {
    try {
        for (let key in markerCollect) {
            if (Object.keys(markerCollect).length) {
                if (markerCollect[key]['marker'].length) {
                    markerCollect[key]['marker'].forEach((item: any) => {
                        if (item && item.markerObj) {
                            map.value.removeLayer(item.markerObj)
                        }
                    })
                }
            }
        }
    } catch (err) {
        console.log(err)
    }
}
// 数据相关
const getDealerList = async () => {
    const res: carDealerResponseData = await carDealer_API()
    dealerList.value = res.data
}
const changeisShow = (val: boolean) => {
    isShow.value = val
}
getDealerList()
// 获取经销商下车辆列表
const getDealerCarList = async () => {
    const res: dealerCarResponseData = await getCarDealerList_API(pageInfo.companyId)
    Object.assign(CarDealerList, res.data)
}
getDealerCarList()
const getPaddyWorkList = async () => {
    const res: paddyWorkListResponsenumber = await paddyWorkList_API(pageInfo)
    paddyWorkList.value = res.data.records
    let tem = res.data.records
    tem.forEach((element) => {
        markerCollect[element.id] = { marker: [], }
        element.checked = false
    })
    // ids.value.push(paddyWorkList.value[0].id as never)
    // paddyWorkList.value[0].checked = true
    total.value = res.data.total
}
getPaddyWorkList()
const changeBlur1 = () => {
    getDealerCarList()
    clearAllMarkers()
    Object.assign(markerCollect, {})
    paddyWorkList.value = []
    pageInfo.currentPage = 1
    pageInfo.pageSize = 7
    pageInfo.carId = '请选择'
    initMap()

}
const changeBlur2 = () => {
    clearAllMarkers()
    Object.assign(markerCollect, {})
    pageInfo.currentPage = 1
    pageInfo.pageSize = 7
    paddyWorkList.value = []
    getPaddyWorkList()
}

const load = () => {
    console.log(pageInfo.pageSize);
    pageInfo.pageSize < total.value ? pageInfo.pageSize += 2 : ''

}
watch(() => pageInfo.pageSize,
    () => {
        getPaddyWorkList()
    }
)
watch(() => ids.value,
    () => {
        paddyWorkList.value.forEach((item: any) => {
            if (ids.value.includes(item.id as never)) {
                item.checked = true
            } else {
                item.checked = false
            }
        })

        // loadWorkData(['338', '339'].join())
    }
)
watch(() => paddyWorkList.value,
    (newData) => {
        if (newData.length) {
            newData.forEach((subItem) => {
                if (subItem.checked) {
                    if (!hasMarker(subItem.id)) {
                        addPathAB(subItem)
                    } if (!hasMarkerField(subItem.id, 'lines')) {
                        loadWorkData(ids.value.join())
                    }
                } else {
                    removeMarker([subItem.id].join())
                }
            })
        }
    }, { deep: true })
</script>

<style lang="scss" scoped>
.page7_child6_container {
    width: 100%;
    height: 100%;
    position: relative;

    #child6_map {
        height: 100%;
        width: 100%;
    }

    .map_selector {
        position: absolute;
        bottom: 10px;
        left: 10px;
        z-index: 999;
        max-width: 110px;
    }

    .head_top {

        display: flex;
        justify-content: space-between;
        padding: 0px 10px;

        .left {
            z-index: 999;
            position: absolute;
            left: 47px;
            top: 33px;
        }

        .right {
            z-index: 999;
            position: absolute;
            right: 47px;
            top: 33px;

            .el_icon {
                border-radius: 2px;
                margin-left: auto;
                margin-right: 10px;
                margin-bottom: 6px;
                display: flex;
                justify-content: center;
                align-items: center;
                width: 14px;
                height: 14px;
                border: 1px solid black;
            }

            .infiniteMenu {
                padding-top: 10px;
                margin-top: 5px;
                margin-left: auto;
                width: 194px;
                border-radius: 4px;
                background-color: #fff;

                .li_title {
                    overflow: hidden;
                    margin-left: 10px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    width: 75px;
                    height: 27px;
                    border-radius: 4px;
                    background: rgba(67, 207, 124, 1);
                    color: #fff;
                    white-space: nowrap;
                }

                .infinite-list {
                    max-height: 300px;
                    transition: all 1s;
                    padding: 0;
                    margin: 0;
                    list-style: none;

                    span {
                        width: 100%;
                        display: block;
                        display: flex;
                        justify-content: center;
                        font-size: 10px;
                    }
                }

                .infinite-list::-webkit-scrollbar {
                    display: none;
                }

                .infinite-list .infinite-list-item {
                    display: flex;
                    align-items: center;
                    justify-content: space-around;
                    width: 95%;
                    height: 50px;
                    opacity: 1;
                    border-radius: 4px;
                    background: rgba(199, 242, 216, 1);
                    margin: 8px 5px;
                    box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.25);
                }

                .infinite-list .infinite-list-item2 {
                    display: flex;
                    align-items: center;
                    justify-content: space-around;
                    width: 95%;
                    height: 50px;
                    opacity: 1;
                    border-radius: 4px;
                    background: #fff;
                    margin: 8px 5px;
                    box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.25);
                }

                .infinite-list .infinite-list-item+.list-item {
                    margin-top: 10px;
                }
            }

            .infiniteMenu2 {
                padding-top: 10px;
                margin-top: 5px;
                margin-left: auto;
                width: 194px;
                border-radius: 4px;
                background-color: #fff;

                .li_title {
                    overflow: hidden;
                    margin-left: 10px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    width: 75px;
                    height: 27px;
                    opacity: 1;
                    border-radius: 4px;
                    background: rgba(67, 207, 124, 1);
                    color: #fff;
                    white-space: nowrap;
                }

                .infinite-list {
                    transition: all 1s;
                    max-height: 0px;
                    padding: 0;
                    margin: 0;
                    list-style: none;

                    span {
                        width: 100%;
                        display: block;
                        display: flex;
                        justify-content: center;
                        font-size: 10px;
                    }
                }

                .infinite-list::-webkit-scrollbar {
                    display: none;
                }

                .infinite-list .infinite-list-item {
                    display: flex;
                    align-items: center;
                    justify-content: space-around;
                    width: 95%;
                    height: 50px;
                    opacity: 1;
                    border-radius: 4px;
                    background: rgba(199, 242, 216, 1);
                    margin: 8px 5px;
                    box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.25);
                }

                .infinite-list .infinite-list-item2 {
                    display: flex;
                    align-items: center;
                    justify-content: space-around;
                    width: 95%;
                    height: 50px;
                    opacity: 1;
                    border-radius: 4px;
                    background: #fff;
                    margin: 8px 5px;
                    box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.25);
                }

                .infinite-list .infinite-list-item+.list-item {
                    margin-top: 10px;
                }
            }
        }
    }
}
</style>