import Vue from "vue"
import Vuex from "vuex"

import modules from "@/store/modules"
import mutations from "@/store/mutations"
import actions from "@/store/actions"

Vue.use(Vuex)
const state = () => {
    return {
        memberData: JSON.parse(JSON.stringify(localStorage.getItem("user"))) || false,
        isLoggedin: JSON.parse(localStorage.getItem("api-key")) || false,
        isLoginFailure: false,
        newUser: false
    }
}
const getters = {
    getOne: (state) => (param) => {
        return state.collections[param.collection].find(
            (item) => item._id === param.id
        )
    },
    getAll: (state) => (collectionName) => {
        return state.collections[collectionName]
    },
    isLoggedin: (state) => {
        return state.isLoggedin
    },
    user: (state) => {
        return state.memberData
    },
    isLoginFailure: (state) => {
        return state.isLoginFailure
    },
    collections: (state) => (name) => {
        return state.collections[name]
    },
    requests: (state) => {
        return state.collections.requests
    },
    messages: (state) => {
        return state.collections.messages
    },
    members: (state) => {
        return state.collections.members
    },
    cases: (state) => {
        return state.collections.cases
    },
    getMember: (state) => (id) => {
        return state.collections.members.filter((member) => member._id === id)[0]
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

export default new Vuex.Store({
    state,
    getters,
    mutations,
    actions,
    modules: {
        ...modules
    }
})