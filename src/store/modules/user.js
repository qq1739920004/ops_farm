// import { login, logout, getInfo } from '@/api/user'
// import { getToken, setToken, removeToken } from '@/utils/auth'
// import { resetRouter } from '@/router'

const state = {
  token: '',
  nickName: '',
  userId: '',
  companyId: '',
  sn: ''
}

const mutations = {
  SET_TOKEN: (state, token) => {
    state.token = token
  },
  SET_NICKNAME: (state, nickName) => {
    state.nickName = nickName
  },
  SET_USERID: (state, userId) => {
    state.userId = userId
  },
  SET_COMPANYID: (state, companyId) => {
    state.companyId = companyId
  },
  SET_SN: (state, sn) => {
    state.sn = sn
  },
  RESET_STATE: state => {
    state.token = ''
    state.nickName = ''
    state.userId = ''
    state.companyId = ''
    state.sn = ''
  }
}

const actions = {
  getUserInfo({ commit }, userInfo) {
    const { token, nickName, userId, companyId, sn } = userInfo
    commit('SET_TOKEN', token)
    commit('SET_NICKNAME', nickName)
    commit('SET_USERID', userId)
    commit('SET_COMPANYID', companyId)
    commit('SET_SN', sn)
  },

  // user logout
  logout({ commit, state }) {
    commit('RESET_STATE') // 退出登陆清除用户数据
    var d = new Date()
    d.setTime(d.getTime() + -1 * 24 * 60 * 60 * 1000)
    var expires = 'expires=' + d.toUTCString()
    document.cookie = 'loginSysCookie' + '=' + 0 + ';' + expires + ';path=/;domain=' + window.cookiedomain
    location.href = '/#/login/login?clientUrl=' + location.href // 跳转到外部登陆页面////
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
