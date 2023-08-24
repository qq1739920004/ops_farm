<!--  -->
<template>
    <div class="page7_child6_container">
        <div id="child6_map" class="">123</div>
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
                            :class="ids.includes(item.id as never) ? 'infinite-list-item' : 'infinite-list-item2'">
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
import router from '@/router'
import L from "leaflet";
// import L from 'leaflet'
// 提交的车辆数组
const ids = ref<[]>([])
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
    ids.value.push(paddyWorkList.value[0].id as never)
    total.value = res.data.total
}
getPaddyWorkList()
const changeBlur1 = () => {
    getDealerCarList()
    pageInfo.carId = '请选择'
    paddyWorkList.value = []
}
const changeBlur2 = () => {
    getPaddyWorkList()
}

const load = () => {
    console.log(pageInfo.pageSize);
    pageInfo.pageSize < total.value ? pageInfo.pageSize += 2 : ''

}
watch(() => pageInfo.pageSize,
    () => {
        getPaddyWorkList()
    })
</script>

<style lang="scss" scoped>
.page7_child6_container {
    .child6_map {
        height: 100%;
        width: 100%;
    }

    .head_top {
        z-index: 999;
        display: flex;
        justify-content: space-between;
        padding: 0px 10px;

        .right {
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