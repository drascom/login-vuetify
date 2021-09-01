import "@fortawesome/fontawesome-free/css/all.css"
import "material-design-icons-iconfont/dist/material-design-icons.css"

import Vue from "vue"
import Vuetify from "vuetify/lib"

import { TiptapVuetifyPlugin } from "tiptap-vuetify"
import "tiptap-vuetify/dist/main.css"

import colors from "vuetify/lib/util/colors"
const vuetify = new Vuetify({
    icons: {
        iconfont: "md" || "fa"
    },
    theme: {
        themes: {
            light: {
                background: colors.grey.lighten2 // Not automatically applied
            },
            dark: {
                background: colors.shades.white // If not using lighten/darken, use base to return hex
            }
        }
    }
})

Vue.use(Vuetify)
Vue.use(TiptapVuetifyPlugin, {
    // the next line is important! You need to provide the Vuetify Object to this place.
    vuetify, // same as "vuetify: vuetify"
    // optional, default to 'md' (default vuetify icons before v2.0.0)
    iconsGroup: "md"
})

export default vuetify