import api from "axios"

const LOGIN_END_POINT = "/api/cockpit/authUser"
const SAVE_END_POINT = "/api/cockpit/saveUser"
const LIST_END_POINT = "/api/cockpit/listUsers"
const FILES_END_POINT = "/files"
export default {
    login(payload) {
        return api.post(LOGIN_END_POINT, payload)
    },
    getOne(payload) {
        return api.post(LIST_END_POINT, payload)
    },
    async all(payload) {
        const params = {
            ...payload.data,
            limit: null,
            // skip: 0,
            populate: 1,
            simple: 1
        }
        return api.post(`${LIST_END_POINT}`, params)
    },
    getAvatar(id) {
        console.log(id)
        return api.get(`${FILES_END_POINT}/${id}`, {
            params: { fields: "private_hash" }
        })
    },
    save(payload) {
        return api.post(SAVE_END_POINT, { user: payload })
    },
    deleteItem(url, id) {
        return api.delete(`${url}/${id}`)
    }
}