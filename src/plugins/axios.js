/* eslint-disable no-unused-vars */
import Vue from "vue"
import axios from "axios"
import store from "@/store/index.js"

axios.defaults.baseURL = process.env.VUE_APP_API_URL
axios.defaults.headers.common["Content-Type"] = "application/json"
axios.defaults.headers.common["Cockpit-Token"] =
    "02addf09176edcfd28734398683fa3"
axios.interceptors.request.use(
    (config) => {
        //START REQUEST SET LOADING STATUS TRUE IF SERVER ONLINE
        if (
            store.state.system.isServerOnline &&
            config.url !== "api/public/status"
        ) {
            store.commit("system/SET_LOADING_STATUS", true, { root: true })
        }
        return config
    },
    (error) => {
        //START REQUEST SET LOADING STATUS TRUE
        store.commit("system/SET_LOADING_STATUS", false, { root: true })
            // Do    something with request error
        console.log("axios request error", error)
        return Promise.reject(error)
    }
)

axios.interceptors.response.use(
    (response) => {
        //START REQUEST SET LOADING STATUS TRUE
        if (response && response.config.url !== "api/public/status") {
            store.commit("system/SET_LOADING_STATUS", false, { root: true })
        }
        return response
    },
    (error) => {
        if (error && error.response) {
            store.commit(
                "system/SET_NETWORK_ERROR", { title: error.response.statusText, msg: error.response.data.error }, { root: true }
            )
        } else if (error.request) {
            const status = store.state.system.isServerOnline
            if (status) {
                store.commit("system/SET_SERVER_STATUS", false, { root: true })
            }
            console.log("error on request", error.request)
        } else {
            // Something happened in setting up the request and triggered an Error
            console.log("en son Error", error)
        }
        return Promise.reject(error)
    }
)

// eslint-disable-next-line no-shadow
Plugin.install = (Vue) => {
    Vue.axios = axios
    window.axios = axios
    Object.defineProperties(Vue.prototype, {
        axios: {
            get() {
                return axios
            }
        },
        $axios: {
            get() {
                return axios
            }
        }
    })
}

Vue.use(Plugin)

export default Plugin