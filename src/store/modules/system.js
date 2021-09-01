/* eslint-disable no-unused-vars */
/* eslint-disable no-shadow */
import apiModule from "@/api/index.js"
import packageJson from "../../../package.json"

export const state = {
    cookie: JSON.parse(localStorage.getItem("cookie:accepted") || false),
    message: "",
    title: "",
    loading: false,
    deleted: false,
    isServerOnline: true,
    appVersion: packageJson.version
}
export const getters = {
    appCookie: (state) => state.cookie,
    appVersion: (state) => state.appVersion,
    errorText: (state) => {
        return {
            title: state.title,
            msg: state.message
        }
    },
    ifServerOnline: (state) => state.isServerOnline,
    ifDeleted: (state) => state.deleted
}
export const mutations = {
    ["SET_APP_VERSION"](state, version) {
        state.appVersion = version
    },
    ["SET_NETWORK_ERROR"]: (state, payload) => {
        state.message = payload.msg
        state.title = payload.title
    },
    ["SET_SERVER_STATUS"]: (state, payload) => {
        state.isServerOnline = payload
    },
    ["SET_LOADING_STATUS"]: (state, payload) => {
        state.loading = payload
    },
    ["SET_DELETED_STATUS"]: (state, payload) => {
        state.deleted = payload
        setTimeout(function() {
            state.deleted = false
        }, 2000)
    }
}
export const actions = {
    setResponse: ({ commit }, payload) => {
        commit("SET_NETWORK_ERROR", payload)
    },

    checkIfServerOnline: ({ commit, state }) => {
        let status = false
        return apiModule["updateSite"].checkIfServerOnline().then((res) => {
            if (res && res.status === 200) {
                if (!state.isServerOnline) {
                    commit("SET_SERVER_STATUS", true)
                }
            }
        })
    },
    setAppVersion({ commit }, payload) {
        commit("SET_APP_VERSION", payload)
    }
}
export default {
    namespaced: true,
    state,
    getters,
    mutations,
    actions
}