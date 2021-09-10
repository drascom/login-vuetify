import Vue from "vue"
import App from "./App.vue"
import router from "./router"
import vuetify from "./plugins/vuetify"
import store from "@/store"
import "@/plugins/axios"
import "@/plugins/moment"
Vue.config.productionTip = false

Vue.directive("uppercase", {
    update(el) {
        console.log(el.getElementsByTagName("input")[0])
        const sourceValue = el.getElementsByTagName("input")[0].value
        const newValue = sourceValue.toUpperCase()

        if (sourceValue !== newValue) {
            el.getElementsByTagName("input")[0].value = newValue
            el = el.getElementsByTagName("input")[0]
            el.dispatchEvent(new Event("input", { bubbles: true }))
        }
    }
})
new Vue({
    router,
    vuetify,
    store,
    render: (h) => h(App)
}).$mount("#app")