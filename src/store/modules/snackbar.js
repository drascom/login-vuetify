export default {
    namespaced: true,
    name: "snackbar",
    state: {
        items: []
    },
    mutations: {
        success(context, value) {
            context.items.push({
                message: value,
                color: "green",
                timeout: 2000
            })
        },
        error(context, value) {
            context.items.push({
                message: value,
                color: "red",
                timeout: 2000
            })
        },
        info(context, value) {
            context.items.push({
                message: value,
                color: "blue",
                timeout: 2000
            })
        },
        warning(context, value) {
            context.items.push({
                message: value,
                color: "orange",
                timeout: 2000
            })
        },
        cleanup(context, value) {
            context.items = value
        }
    }
}