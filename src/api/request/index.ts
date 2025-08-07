import axios from 'axios';
export function getWSUrl_API() { // 接口名称的定义必须加上_API
    return axios({
        url: `${location.pathname}config.json`,
        method: 'get',        
    })
}

