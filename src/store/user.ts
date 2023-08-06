import { defineStore } from 'pinia'

const useUserStore = defineStore("user", {
    state: () => (
        {
            nickName: 'ls',
        }
    ),
    getters: {
        ddNickname(state) { return state.nickName + 'ss' },

    },
    actions: {
        updateNickName(name: string) {
            this.nickName = name
        },
    }

})

export default useUserStore
