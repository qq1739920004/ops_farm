import bus from './bus'
import Vue from 'vue'
// import db from './db'

let baseURL;
let token = ''
let socket = null
let conncetTimer = null
if (process.env.NODE_ENV === 'production') {
  baseURL = window.socketAddress;
}
if (process.env.NODE_ENV === 'development') {
  baseURL = `ws://192.168.2.145:9034`;
}

function decodeToken() {
  try {
    token = document.cookie
      .split(';')
      .find(item => item.includes('loginSysCookie'))
      .split('=')[1]
      .split('#')
      .join('_') // 解析token
  } catch (err) {
    console.log('无法解析token')
    console.log(err)
  }
}

function connectWebsocket() {
  try {
    const websocketURL = `${baseURL}/websocket?token=${token}`
    console.log(websocketURL)
    socket = new WebSocket(websocketURL)

    // @open事件
    socket.addEventListener('open', function() {
      console.log(`%c websocket ${baseURL} connected!`, 'color: #4DBB18')
      heart.ping()
    })

    /**
     * @消息类型
     * @online
     * @upline
     * @offline
     */
    socket.addEventListener('message', function(event) {
      try {
        let socketData = JSON.parse(event.data)
        bus.$emit('message', socketData)
        notification(socketData)
        // process.env.NODE_ENV === 'development' ? db.appendMsg(socketData) : '';
      } catch (err) {
        console.log(new Date().toLocaleString())
        console.log(err)
        console.log(event)
      }
    })

    // @close事件
    socket.addEventListener('close', function() {
      console.log('websocket connection closed!')
      reConnectWebsocket()
      heart.clearTimerId()
    })

    // @error事件
    socket.addEventListener('error', function(event) {
      console.log('WebSocket error: ', event)
      reConnectWebsocket()
      heart.clearTimerId()
    })
  } catch (err) {
    console.log(err)
    console.log('初始化websocket失败！')
  }
}

function reConnectWebsocket() {
  if (conncetTimer) return // 锁 防止websocket close 与 error 事件中同时调用，导致两次重连。

  console.log('5s后, 等待websocket 重连！')
  conncetTimer = setTimeout(() => {
    conncetTimer = null
    connectWebsocket()
  }, 5000)
}

// 全局通知升级事件
function notification(socketData) {
  try {
    if (socketData.type === 'onlineUpgrade' && socketData.module === 'farm') {
      let type = socketData.data.result === 0 ? 'success' : 'error'
      let title = `设备${socketData.deviceSn}升级${
        socketData.data.result === 0 ? '成功' : '失败'
      }`
      let upgradeModule = {
        9: 'AG302',
        10: 'EC20配置文件',
        11: 'EC20',
        12: '板卡',
        14: 'LORA',
        13: '电台',
        15: '车身IMU',
        16: '车轮IMU',
        17: '电机',
        18: '多功能方向盘',
        19: '多功能方向盘蓝牙',
        20: 'Hub',
        21: 'Hub蓝牙'
      }
      Vue.prototype.$notify({
        type: type,
        title: title,
        dangerouslyUseHTMLString: true,
        message: `
                    <div>
                        <div>版本：${socketData.data.version || '/'}</div>
                        <div>模块：${upgradeModule[
                          socketData.data.updateModel
                        ] || '/'}</div>
                    </div>
                `
      })
    }
  } catch (error) {
    console.log(error)
  }
}

// 心跳
let heart = {
  interval: 20000,
  timerId: null,
  message: 0,
  ping() {
    if (socket) {
      this.timerId = setInterval(() => {
        let tem = ++this.message
        socket.send(tem)
        console.log(`%c heart pong ${tem}`, 'color:#9b59b6')
      }, this.interval)
    }
  },
  clearTimerId() {
    if (this.clearTimerId) {
      clearInterval(this.timerId)
      this.timerId = null
    }
  }
}

// 顺序执行
decodeToken()
connectWebsocket()
