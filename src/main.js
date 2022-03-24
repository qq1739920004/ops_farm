import Vue from 'vue'
import 'normalize.css/normalize.css' // A modern alternative to CSS resets
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import '@/styles/index.scss' // global css
import App from './App'
import store from './store'
import router from './router'
import i18n from '@/lang'
import filters from '@/filter/index'
import '@/utils/directive'
import '@/icons' // icon
import '@/utils/socket/socket'
import state from '@/store'
import { permissionList_path } from '@/api'
// import '@/permission' // permission control

for (let filter in filters) {
	Vue.filter(filter, filters[filter]);
	Vue.prototype[filter] = filters[filter]; // 挂载工具库
}

Vue.use(ElementUI)
Vue.config.productionTip = false

/**
 * @公共组件注册
 */
import pageHead from '@/components/common/pageHead'
import counter from '@/components/common/counter'

Vue.component('pageHead', pageHead);
Vue.component('counter', counter);

new Vue({
  el: '#app',
  router,
  store,
  i18n,
  render: h => h(App)
})

/**
 * @解析cookie数据存入store
 */
if (document.cookie) {
  try {
    let cookie = document.cookie.split(';').find(item => {
      return item.includes('loginSysCookie')
    })
    let [token, nickName, userId, companyId, sn = ''] = cookie
      .split('=')[1]
      .split('#')
    store.dispatch('user/getUserInfo', {
      token,
      nickName,
      userId,
      companyId,
      sn
    })
    store.dispatch('index/setAdmin')
    store.dispatch('index/setMessageNum')
  } catch (err) {
    console.log(err)
  }
}

permissionList_path().then(res => {
  if(res.status == 200) {
    store.dispatch('index/setPermission',res.data.data)
  }
})
