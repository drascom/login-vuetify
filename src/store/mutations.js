export default {
    SET_NEW_USER(state, payload) {
        state.newUser = payload
    },
    SET_USER(state, payload) {
        if (payload.published) {
            state.isLoggedin = true
        }
        state.memberData = payload
    },
    logout(state) {
        localStorage.removeItem("api_key")
        localStorage.removeItem("user")
        state.isLoggedin = false
    },
    SET_ITEMS(state, payload) {
        state[payload.parent][payload.child] = payload.respData
        state.total = payload.respData.length
    }
}