import Vue from "vue"
import VueRouter from "vue-router"
import store from "@/store"
import Home from "../views/Home.vue"
import Login from "@/components/Login.vue"

Vue.use(VueRouter)

/* eslint-disable no-unused-vars */
const routes = [{
        path: "/",
        name: "home",
        component: Home
    },
    {
        path: "/login",
        name: "login",
        component: Login
    },
    {
        path: "/dashboard",
        name: "dashboard",
        meta: {
            requiresAuth: true
        },
        // route level code-splitting
        // this generates a separate chunk (about.[hash].js) for this route
        // which is lazy-loaded when the route is visited.
        component: () =>
            import ( /* webpackChunkName: "Dashboard" */ "../views/Dashboard.vue")
    }
]

const router = new VueRouter({
    mode: "history",
    base: process.env.BASE_URL,
    routes
})

router.beforeEach((to, from, next) => {
    const token = window.localStorage.getItem("api_key")
    const lastPage = window.localStorage.getItem("last-page")
    const requiresAuth = to.matched.some((record) => record.meta.requiresAuth)
    store.state.user.isLoggedin = token ? true : false
    if (requiresAuth) {
        if (to.fullPath === "/login") {
            if (token) {
                next()
            } else {
                next()
            }
        } else {
            if (token) {
                next()
            } else {
                window.localStorage.setItem("last-page", JSON.stringify(to))
                next("/login")
            }
        }
    }
    return next()
})
export default router