import api from "axios"

const END_POINT = "/api/collections"
export default {
    async all(payload) {
        const params = {
            fields: payload.data.fields ? payload.data.fields : "",
            filter: payload.data.filter ? payload.data.filter : {},
            populate: payload.data.populate ? payload.data.populate : 0,
            lang: payload.data.lang ? payload.data.lang : "tr",
            sort: payload.data.sort || { _created: 1 },
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
    async delete(payload) {
        const params = {
            name: payload.child,
            filter: payload.data.filter || ""
        }
        return api
            .post(`${END_POINT}/remove/${payload.child}`, params)
            .then((res) => {
                return res
            })
    }
    // async delete(payload) {
    //     console.log("api delete payload", payload)
    //     const params = {
    //         name: payload.child,
    //         filter: { _id: payload.data }
    //     }
    //     return api
    //         .post(`${END_POINT}/remove/${payload.child}`, params)
    //         .then((res) => {
    //             return res
    //         })
    // }
}