/* eslint-disable no-unused-vars */
import Vue from "vue"
const moment = require("moment")
import tr from "moment/locale/tr"
Vue.use(require("vue-moment"), { moment })
console.log(Vue.moment().locale())