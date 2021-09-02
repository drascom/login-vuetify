/* eslint-disable no-unused-vars */
/* eslint-disable no-shadow */
import api from "@/api/users.js"

const state = () => {
    return {
        userData: JSON.parse(localStorage.getItem("user")) || false,
        isLoggedin: false,
        isLoginFailure: false,
        newUser: false
    }
}
const actions = {
    login({ commit }, payload) {
        return api
            .login(payload)
            .then(async(response) => {
                commit("SET_USER", response.data)
                localStorage.setItem("user", JSON.stringify(response.data))
                localStorage.setItem("api_key", JSON.stringify(response.data.api_key))
                return response
            })
            .then((res) => {
                console.log("login store success", res)
            })
            .catch((error) => {
                console.log("login store error", error)
            })
    },
    register({ commit }, payload) {
        return api
            .save(payload)
            .then(async(response) => {
                commit("SET_NEW_USER", response.data)
                return response
            })
            .catch((error) => {
                console.log("register store error", error.response)
                return error.response.data
            })
    }
}
const mutations = {
    SET_NEW_USER(state, payload) {
        state.newUser = payload
    },
    SET_USER(state, payload) {
        if (payload.published) {
            state.isLoggedin = true
        }
        state.userData = payload
    },
    logout(state) {
        localStorage.removeItem("api_key")
        localStorage.removeItem("user")
        state.isLoggedin = false
    }
}
export default {
    namespaced: true,
    state,
    mutations,
    actions
}