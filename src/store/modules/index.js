// import { login, logout, getInfo } from '@/api/user'
// import { getToken, setToken, removeToken } from '@/utils/auth'
// import { resetRouter } from '@/router'
import { farmSuperAdministrator_path, helpList_path } from '@/api/index'

const state = {
    netSingalCount: [],
    farmSuperAdministrator: false,
    messageNum: 0,
    // 权限控制
    permission: [],
    fileBreadcrumb: JSON.parse(localStorage.getItem('fileBreadcrumb') || '[]')//文件存储面包屑
}

const mutations = {
    SET_NETSINGALCOUNT: (state, netSingalCount) => {
        state.netSingalCount = netSingalCount
    },
    SET_FARMSUPERADMINISTRATOR: (state, farmSuperAdministrator) => {
        state.farmSuperAdministrator = farmSuperAdministrator
    },
    SET_MESSAGENUM: (state, messageNum) => {
        state.messageNum = messageNum
    },
    SET_FILEBREADCRUMB(state, fileBreadcrumb) {
        if (!fileBreadcrumb.val) {
            state.fileBreadcrumb.length = 0
            localStorage.setItem('fileBreadcrumb', JSON.stringify([]))
            return
        }
        if (state.fileBreadcrumb.length > fileBreadcrumb.num - 1) {
            state.fileBreadcrumb.pop()
        }
        if (state.fileBreadcrumb.indexOf(fileBreadcrumb.val) < 0) {
            state.fileBreadcrumb.push(fileBreadcrumb.val)
        }
        localStorage.setItem('fileBreadcrumb', JSON.stringify(state.fileBreadcrumb))

    },
    SET_PERMISSION(state, permission) {
        state.permission = permission
    }
}

const actions = {
    setAdmin({ commit, state }) {
        farmSuperAdministrator_path().then(res => {
            try {
                commit('SET_FARMSUPERADMINISTRATOR', res.data.data)
                localStorage.setItem('farmSuperAdministrator', res.data.data);
            } catch (error) {
                console.log(error)
            }
        })
    },
    setNetSingalCount({ commit }, netSingalCount) {
        commit('SET_NETSINGALCOUNT', netSingalCount)
    },
    setMessageNum({ commit }, messageNum) {
        try {
            let params = new URLSearchParams();
            params.append('status', '0');
            helpList_path(params).then(response => {
                commit('SET_MESSAGENUM', response.data.data.total)
            });
        } catch (error) {
            console.log(error);
        }
    },
    setfileBreadcrumb({ commit }, fileBreadcrumb) {
        commit('SET_FILEBREADCRUMB', fileBreadcrumb)

    },
    setPermission({ commit }, permission) {
        commit('SET_PERMISSION',permission)
    }
}

export default {
    namespaced: true,
    state,
    mutations,
    actions
}

