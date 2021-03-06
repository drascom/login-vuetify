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
            dispatch("getAllItems", { name: payload.name, data: {} })
        })
    },
    login({ commit }, payload) {
        return api[payload.parent].all(payload).then(
            (response) => {
                if (response.data) {
                    commit("SET_USER", response.data[0], { root: true })
                    localStorage.setItem("user", JSON.stringify(response.data[0]))
                    localStorage.setItem("api_key", JSON.stringify(response.data[0]._id))
                    commit("snackbar/success", "Giri?? ba??ar??l??")
                    return response.data
                } else {
                    console.log("no data in response")
                }
            },
            (error) => {
                console.log(
                    `Kodl: ${error.response.status} ${error.response.data.error}`
                )
                commit("snackbar/error", error.response.data.error)
                return "Kod: " + error.response.status + " " + error.response.data.error
            }
        )
    },
    register({ commit }, payload) {
        return api["collections"]
            .save({
                child: "members",
                data: payload
            })
            .then((response) => {
                if (response && response.data) {
                    console.log("register", response)
                    commit("snackbar/success", response.data.name + " kayd??n??z al??nd??.")
                    return true
                } else {
                    commit("snackbar/error", "Formda hata  " + response)
                    return false
                }
            })
            .catch((error) => {
                commit("snackbar/error", "Formda hata  " + error)
            })
    },
    forgot({ commit }, payload) {
        return api["collections"]
            .all({
                child: "members",
                data: payload.data
            })
            .then(
                (response) => {
                    console.log("forgot response", response)
                    if (response.data.length > 0) {
                        commit(
                            "snackbar/success",
                            response.data[0].name + " S??f??rlama talebi g??nderildi."
                        )
                        return true
                    } else {
                        console.log("email forgot data not array")
                        return false
                    }
                },
                (error) => {
                    console.log(
                        `Kodf: ${error.response.status} ${error.response.data.error}`
                    )
                    commit("snackbar/error", "Formda hata  " + error.response.data.error)
                    return false
                }
            )
    },
    check({ commit }, payload) {
        return api["collections"]
            .all({
                child: "members",
                data: payload
            })
            .then(
                (response) => {
                    if (response.data.length > 0) {
                        return true
                    } else {
                        console.log("token sorgusu bo??")
                        return false
                    }
                },
                (error) => {
                    console.log(
                        `Kodf: ${error.response.status} ${error.response.data.error}`
                    )
                    commit("snackbar/error", "Formda hata  " + error.response.data.error)
                    return false
                }
            )
    },
    //member online durumunu g??nceller
    updateUserOnlineStatus({ commit }, id) {
        return api["collections"].updateUserStatus({
            id: id,
            token: "7c4301e2281654eda6b1eff9bd00bf"
        })
    }
}