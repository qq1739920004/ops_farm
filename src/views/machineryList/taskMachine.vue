<!--  -->
<template>
    <div class="page7_child6_container">
        <div id="child6_map" class=""></div>
        <div class="map_selector">
            <el-select style="width: 99px;height: 32px;opacity: 1;border-radius: 4px;" v-model="mapId" placeholder=""
                @change="hangleSelectChange">
                <el-option v-for="(item, index) in mapOptions" :key="index" :label="item.mapName" :value="item.mapId" />
            </el-select>
        </div>
        <div class="demo-date-picker">
            <div class="top_sn">历史轨迹-{{ pageInfoData.sn }}</div>
            <div class="block">
                <span>开始日期：</span>
                <el-date-picker class="date_picker" v-model="value1" type="datetime" placeholder="Select date and time"
                    :clearable="false" prefix-icon="Clock" :disabled-date="disabledDate" @change="changeA()" />
            </div>
            <div class="block">
                <span>结束日期：</span>
                <el-date-picker class="date_picker" v-model="value2" type="datetime" placeholder="Select date and time"
                    :clearable="false" prefix-icon="Clock" :disabled-date="disabledDate" @change="changeA()" />
            </div>
            <div class="btn_area">
                <el-button type="primary" icon="Search" v-if="!loading" @click="getSingleCarTrick">查询</el-button>
                <el-button type="primary" loading v-else>查询</el-button>
            </div>
        </div>
        <div class="head_top">
            <div class="left">
                <el-button type='primary' icon="back" @click="router.go(-1)">返回</el-button>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { PageInfoObj, singleCarTrackResponseData } from '@/api/machineryList/type'
import { getSingleCarTrick_API } from '@/api/machineryList/index'
import { ref, reactive, watch, onMounted } from 'vue'
import router from '@/router'
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet.pm";
import "leaflet.pm/dist/leaflet.pm.css";
import { ElMessage } from 'element-plus'
import gcoord from 'gcoord'
import { useRoute } from "vue-router";
const route = useRoute();

// 提交的车辆数组
// 按钮控制
const loading = ref<boolean>(false)
// 提交数据
const pageInfoData = reactive<PageInfoObj>({
    'sn': '',
    'npn': '',
    'st': '',
    'et': ''
})
const value1 = ref<Date>()
const value2 = ref<Date>()
const a = ref<Date>()
onMounted(() => {
    Object.assign(pageInfoData, route.query)
    value2.value = new Date();
    const start = new Date();
    start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
    value1.value = start
    pageInfoData.st = formartDate(value1.value)
    pageInfoData.et = formartDate(value2.value)
    initMap()
    getSingleCarTrick()
})
// 时间格式转换
function add0(m: any) {
    return m < 10 ? '0' + m : m;
}
const formartDate = (val: Date) => {
    var y = val.getFullYear();
    var m = val.getMonth() + 1;
    var d = val.getDate();
    var h = val.getHours();
    var mm = val.getMinutes();
    var s = val.getSeconds();
    return y + '-' + add0(m) + '-' + add0(d) + ' ' + add0(h) + ':' + add0(mm) + ':' + add0(s);
}
// 禁止选取的时间
const disabledDate = (time: Date) => {
    return time.getTime() > Date.now()
}
// 监视日期，起始日期大于末尾日期则交换
watch(() => [value1.value, value2.value], () => {
    if (value2.value && value1.value && value2.value.getTime() < value1.value.getTime()) {
        a.value = value1.value
        value1.value = value2.value
        value2.value = a.value
    }
})
// 更改实际time
const changeA = () => {
    if (value1.value && value2.value) {
        pageInfoData.st = formartDate(value1.value)
        pageInfoData.et = formartDate(value2.value)
    }
}

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
const markerCollect = reactive<any>({
    'marker': []
})
const initMap = () => {
    map.value = L.map('child6_map',
        {
            closePopupOnClick: false,
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
            tileLayer.forEach((layer: any) => layer.remove())
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
const saveMarker = (markerObj: any) => {
    try {
        markerCollect['marker'] = markerObj
    } catch (err) {
        console.log(err)
    }
}
// 画线
const getSingleCarTrick = async () => {
    loading.value = true
    removeMarker()
    const res: singleCarTrackResponseData = await getSingleCarTrick_API(pageInfoData)
    if (!res.data.length || res.data === null) {
        loading.value = false
        ElMessage.warning(`${route.query.sn}暂无作业数据,请选择其他时间！`);
        return
    } else {
        let PointListTransed = res.data.map((item2: any) => {
            return coorTransform([item2.posX as never, item2.posY as never], mapId.value) // 转换坐标
        })
        // 取中间点
        let line = L.polyline(PointListTransed, { color: '#00ff00' }).addTo(map.value)
        saveMarker([{ markerObj: line, name: 'lines' }])
        map.value.fitBounds(PointListTransed)
    }
    loading.value = false
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
// 删除区域
const removeMarker = () => {
    try {
        if (markerCollect['marker'].length) {
            let a = markerCollect['marker']
            a.forEach((item: any) => {
                if (item.markerObj) {
                    map.value.removeLayer(item.markerObj)
                }
            })
            markerCollect['marker'] = []
        } else {
        }
    } catch (err) {
        console.log(err)
    }
}
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
        right: 120px;
        z-index: 999;
        width: 99px;
        height: 32px;
        opacity: 1;
        border-radius: 4px;
        background: rgba(255, 255, 255, 1);
    }

    .demo-date-picker {
        position: absolute;
        z-index: 999;
        top: 80px;
        left: 47px;
        width: 302px;
        height: 164px;
        opacity: 1;
        border-radius: 4px;
        background: rgba(255, 255, 255, 1);

        .top_sn {
            display: flex;
            align-items: center;
            justify-content: center;
            width: 302px;
            height: 26px;
            opacity: 1;
            background: var(--el-color-primary);
            font-size: 14px;
            letter-spacing: 0px;
            line-height: 17.38px;
            color: rgba(255, 255, 255, 1);
            margin-bottom: 12px;
        }

        .block {
            height: 42px;
            width: 100%;

            ::v-deep(.date_picker) {
                width: 187px;
                height: 30px;
                opacity: 1;
                border-radius: 4px;
                background: rgba(255, 255, 255, 1);
            }

            span {
                margin-left: 21px;
                font-size: 12px;
                line-height: 17.38px;
            }

        }

        .btn_area {
            display: flex;
            align-items: center;
            justify-content: center;
        }
    }

    .head_top {
        .left {
            z-index: 999;
            position: absolute;
            left: 47px;
            top: 33px;
        }
    }
}
</style>