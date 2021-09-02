/* eslint-disable no-unused-vars */
/* eslint-disable no-shadow */
import api from "@/api/index.js"
import store from "@/store"

export default {
    async getAllItems({ commit }, payload) {
        return await api[payload.parent]
            .all(payload)
            .then((res) => {
                const respData = res.data
                commit("SET_ITEMS", {
                    parent: "collections",
                    child: payload.child,
                    respData
                })
                return res
            })
            .catch((error) => {
                const newPayload = { field: payload.child, respData: { error } }
                if (store._mutations[`${payload.parent}/SET_ITEMS`]) {
                    commit(`${payload.parent}/SET_ITEMS`, newPayload, { root: true })
                }
                return error
            })
    },
    save({ commit, dispatch }, payload) {
        return api[payload.parent]
            .save(payload)
            .then((res) => {
                dispatch("getAllItems", payload)
                console.log("yeniden istendi")
                return res
            })
            .catch((error) => {
                const newPayload = { field: payload.child, respData: { error } }
                return newPayload
            })
    },
    saveSingle({ commit }, payload) {
        return api[payload.parent]
            .save(payload)
            .then((res) => {
                commit(
                    "snackbar/SET_SNACKBAR", {
                        color: "success",
                        message: "Saved."
                    }, { root: true }
                )
                return res
            })
            .catch((error) => {
                return error
            })
    },
    delete({ commit, dispatch }, payload) {
        return api[payload.parent].delete(payload).then((res) => {
            dispatch("getAllItems", payload)
            console.log("yeniden istendi")
            if (res.data.success) {
                commit("system/SET_DELETED_STATUS", true, { root: true })
            }
            return res
        })
    },
    deleteAll({ dispatch }, payload) {
        Promise.all(
            payload.data.map((item) => {
                return api[payload.name].deleteItem(item.id)
            })
        ).finally(() => {
            dispatch("getAllItems", { name: payload.name })
            return true
        })
    },
    login({ commit }, payload) {
        return api[payload.parent].all(payload).then(
            (response) => {
                if (response.data.confirm) {
                    commit("user/SET_USER", response.data, { root: true })
                    localStorage.setItem("user", JSON.stringify(response.data))
                    localStorage.setItem("api_key", JSON.stringify(response.data._id))
                    return response.data
                } else {
                    console.log("loginFailure")
                }
            },
            (error) => {
                console.log("store error")
            }
        )
    },
    register({ commit }, payload) {
        return api["collections"]
            .save({
                parent: "colections",
                child: "members",
                data: payload
            })
            .then((res) => {
                return res
            })
    }
}