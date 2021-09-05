/* eslint-disable no-unused-vars */
/* eslint-disable no-shadow */
import api from "@/api/index.js"
import store from "@/store"

export default {
    getAllItems({ commit }, payload) {
        return api[payload.parent]
            .all(payload)
            .then((res) => {
                const respData = res.data
                commit("SET_ITEMS", {
                    parent: "collections",
                    child: payload.child,
                    respData
                })
                return respData
            })
            .catch((error) => {
                const newPayload = { field: payload.child, respData: { error } }
                if (store._mutations[`${payload.parent}/SET_ITEMS`]) {
                    commit(`${payload.parent}/SET_ITEMS`, newPayload, { root: true })
                }
                return error
            })
    },
    async save({ commit, dispatch }, payload) {
        return await api[payload.parent]
            .save(payload)
            .then((res) => {
                dispatch("getAllItems", {
                    parent: payload.parent,
                    child: payload.child,
                    data: ""
                })
                return res
            })
            .catch((error) => {
                const newPayload = { field: payload.child, respData: { error } }
                return newPayload
            })
    },
    delete({ commit, dispatch }, payload) {
        return api[payload.parent].delete(payload).then((res) => {
            dispatch("getAllItems", {
                parent: payload.parent,
                child: payload.child,
                data: ""
            })
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
                if (response.data[0]._id) {
                    commit("user/SET_USER", response.data[0], { root: true })
                    localStorage.setItem("user", JSON.stringify(response.data[0]))
                    localStorage.setItem("api_key", JSON.stringify(response.data[0]._id))
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