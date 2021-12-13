const L = window.L
let mapMixin = {
    data() {
        return {
            map: null,
            tileUrl: L.TileLayer.ChinaProvider.providers,
            tileLayer: [],
            originPoint: [36.172800343248, 100.406021546488],
            originZoom: 5,
            maxZoom: 18,
            minZoom: 1,
            mapName: 0,
            domID: ''
        }
    },

    methods: {
        /**
         * @param {*domID} id
         * @混入一定要复写这个方法
         * @参数为leaflet需要的domID
         */
        setMapId(id) {
            this.domID = id;
        },

        initMap() {
            this.map = L.map(this.domID, { zoomControl: false, maxZoom: this.maxZoom }).setView(this.originPoint, this.originZoom);
            L.control.scale({ maxWidth: 150, metric: true, imperial: false, position: 'bottomleft' }).addTo(this.map);
            this.handleMapChange(this.mapName);
        },

        handleMapChange(mapId) {
            switch (mapId) {
                case 0 :
                    this.changeTileLayer('Google', 'Satellite');
                    break;
                case 1 :
                    this.changeTileLayer('GaoDe', 'Normal');
                    break;
                case 2 :
                    this.changeTileLayer('Google', 'Normal');
                    break;
                case 3 :
                    this.changeTileLayer('TianDiTu', 'Normal');
                    break;
            }
        },

        changeTileLayer(mapName = 'Google', mapType = 'Satellite') {
            try {
                if (!this.map) {
                    console.warn('未初始化底图实例');
                    return;
                }
                if (this.tileLayer.length) {
                    this.tileLayer.forEach(layer => layer.remove());
                    this.tileLayer = [];
                }
                let mapUrl = this.tileUrl[mapName][mapType];
                let options = {};
                options.subdomains = this.tileUrl[mapName]['Subdomains'];
                if ('tms' in this.tileUrl[mapName]) {
                    options.tms = this.tileUrl[mapName]['tms'];
                }
                if ('key' in this.tileUrl[mapName]) {
                    options.key = this.tileUrl[mapName]['key'];
                }
                for (let key in mapUrl) {
                    let layer = L.tileLayer(mapUrl[key], options).addTo(this.map);
                    this.tileLayer.push(layer);
                }
            } catch (error) {
                console.log(error);
            }
        }
    },

    mounted() {
        this.setMapId();
        this.initMap();
    }
}

export default mapMixin
