import axios from 'axios'
import { Message ,Loading} from 'element-ui'
import qs from 'qs'
// import store from '@/store'
let loadingInstance;

const service = axios.create({
  baseURL: process.env.VUE_APP_BASE_API,
  timeout: 20000,
  headers: {
    'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'
  }
})
// 请求拦截器
service.interceptors.request.use(
  config => {
    config.withCredentials = true

    loadingInstance =  Loading.service({
      lock: true,
      text: 'Loading',
      spinner: 'el-icon-loading',
      background: 'rgba(0, 0, 0, 0.1)'
    });

    if (config.headers['Content-Type'] == 'application/json;charset=UTF-8') { //
    } 
    else { //请求头不为application/json的时候进行qs.stringify
      if (config.data) {
        config.data = qs.stringify(config.data, { arrayFormat: 'repeat' })
      }
    }
    return config
  },
  error => {
    console.log(error)
    return Promise.reject(error)
  }
)
// 相应拦截器
service.interceptors.response.use(
  response => {
    // if (response.headers.redirect) {
    //   location.href = response.headers.redirect
    // }
    loadingInstance.close()
    return response
  },
  error => {
    console.log('err' + error)
    loadingInstance.close()
    Message({
      message: '请求错误，请稍后重试',
      type: 'error',
      duration: 1000
    })
    return Promise.reject(error)
  }
)

export default service
