import "@fortawesome/fontawesome-free/css/all.css"
import "material-design-icons-iconfont/dist/material-design-icons.css"
import "@mdi/font/css/materialdesignicons.css"
import Vue from "vue"
import Vuetify from "vuetify/lib"
import store from "@/store"

import { TiptapVuetifyPlugin } from "tiptap-vuetify"
import "tiptap-vuetify/dist/main.css"

import colors from "vuetify/lib/util/colors"
const vuetify = new Vuetify({
    icons: {
        iconfont: "mdi"
    },
    themes: {
        light: {
            primary: store.state.theme.primary,
            secondary: store.state.theme.secondary,
            accent: colors.deepPurple.accent2,
            error: colors.red.accent4,
            info: colors.blue.lighten1,
            success: colors.green.accent4,
            warning: colors.amber.darken2,
            background: "#F2F3F7", // #ECF0F3
            neu: {
                darken1: "#DDE4EF", // rgba(210, 218, 230, 0.6)
                lighten1: "#FFFFFF" // rgba(255, 255, 255, 0.6)
            },
            primaryBgText: store.state.theme.primaryBgText,
            secondaryBgText: store.state.theme.secondaryBgText
        },
        dark: {
            primary: store.state.theme.primary,
            secondary: store.state.theme.secondary,
            accent: colors.deepPurple.accent2,
            error: colors.red.accent4,
            info: colors.blue.lighten1,
            success: colors.green.accent4,
            warning: colors.amber.darken2,
            background: "#292D32",
            neu: {
                darken1: "#1d1f23", // rgba(210, 218, 230, 0.6)
                lighten1: "#3e4247" // rgba(255, 255, 255, 0.6)
            },
            primaryBgText: store.state.theme.primaryBgText,
            secondaryBgText: store.state.theme.secondaryBgText
        }
    }
})

Vue.use(Vuetify)
Vue.use(TiptapVuetifyPlugin, {
    vuetify,
    iconsGroup: "md"
})

export default vuetify