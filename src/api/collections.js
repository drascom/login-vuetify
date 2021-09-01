import api from "axios"

const END_POINT = "/api/collections"
export default {
    async all(payload) {
        const params = {
            filter: payload.data.filter ? payload.data.filter : "",
            populate: payload.data.populate,
            lang: payload.data.lang ? payload.data.lang : "tr",
            sort: payload.data.sort || { _created: -1 },
            limit: null,
            // skip: 0,
            simple: payload.data.simple ? payload.data.simple : "1"
        }
        let response = api.post(`${END_POINT}/get/${payload.child}`, params)
        return response.entries ? response.entries : response
    },
    async save(payload) {
        return api
            .post(`${END_POINT}/save/${payload.child}`, { data: payload.data })
            .then((res) => {
                return res
            })
            .catch((err) => {
                return err.response.data.error
            })
    },
    async deleteItem(payload) {
        const params = { filter: { _id: payload.data } }
        return api
            .post(`${END_POINT}/remove/${payload.child}`, params)
            .then((res) => {
                return res
            })
    }
}