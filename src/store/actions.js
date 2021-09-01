/* eslint-disable no-unused-vars */
/* eslint-disable no-shadow */
import apiModule from "@/api/index.js"
import store from "@/store"

export default {
    async getAllItems({ commit }, payload) {
        return await apiModule[payload.parent]
            .all(payload)
            .then((res) => {
                const respData = res.data
                commit("SET_ITEMS", {
                    parent: payload.parent,
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
        return apiModule[payload.parent]
            .save(payload)
            .then((res) => {
                dispatch("getAllItems", {
                    parent: payload.parent,
                    child: payload.child
                })
                return res
            })
            .catch((error) => {
                const newPayload = { field: payload.child, respData: { error } }
                return newPayload
            })
    },
    saveSingle({ commit }, payload) {
        return apiModule[payload.parent]
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
        return apiModule[payload.parent]
            .deleteItem({ name: payload.child, data: payload.data })
            .then((res) => {
                dispatch("getAllItems", {
                    parent: payload.parent,
                    child: payload.child
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
                return apiModule[payload.name].deleteItem(item.id)
            })
        ).finally(() => {
            dispatch("getAllItems", { name: payload.name })
            return true
        })
    }
}