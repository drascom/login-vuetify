import Vue from "vue"
import Vuex from "vuex"

import modules from "@/store/modules"
import actions from "@/store/actions"

Vue.use(Vuex)

const getters = {
    isLoggedin: (state) => {
        return state.user.isLoggedin
    },
    user: (state) => {
        return state.user.userData
    },
    isLoginFailure: (state) => {
        return state.user.isLoginFailure
    },
    collections: (state) => {
        return state.collections
    },
    members: (state) => {
        return state.collections.members
    },

    countDuyurular: (state) => {
        return state.collections.duyurular.length
    },
    countMembers: (state) => {
        return state.collections.members.filter((item) => {
            return item.role == "uye"
        }).length
    },
    countModerators: (state) => {
        return state.collections.members.filter((item) => {
            return item.role == "moderator"
        }).length
    },
    countAdmins: (state) => {
        return state.collections.members.filter((item) => {
            return item.role == "admin"
        }).length
    },
    countTeams: (state) => {
        return state.collections.teams.length
    }
}
const mutations = {
    SET_ITEMS(state, payload) {
        state[payload.parent][payload.child] = payload.respData
        state.total = payload.respData.length
    }
}

export default new Vuex.Store({
    getters,
    mutations,
    actions,
    modules: {
        ...modules
    }
})