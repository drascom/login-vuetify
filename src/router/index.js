import Vue from "vue"
import VueRouter from "vue-router"
import store from "@/store"
import Home from "../views/Home.vue"
import Login from "@/components/Login.vue"

Vue.use(VueRouter)

/* eslint-disable no-unused-vars */
const routes = [{
        path: "/",
        name: "Home",
        component: Home
    },
    {
        path: "/login",
        name: "Login",
        component: Login
    },
    {
        path: "/dashboard",
        name: "Dashboard",
        meta: {
            requiresAuth: true
        },
        component: () =>
            import ( /* webpackChunkName: "Dashboard" */ "../views/Dashboard.vue")
    },
    {
        path: "/duyurular",
        name: "Duyurular",
        meta: {
            requiresAuth: true
        },
        component: () =>
            import ( /* webpackChunkName: "Duyurular" */ "../views/Duyurular.vue")
    },
    {
        path: "/teams",
        name: "Teams",
        meta: {
            requiresAuth: true
        },
        component: () =>
            import ( /* webpackChunkName: "Duyurular" */ "../views/Teams.vue")
    },
    {
        path: "/members",
        name: "Members",
        meta: {
            requiresAuth: true
        },
        component: () =>
            import ( /* webpackChunkName: "Duyurular" */ "../views/Members.vue")
    },
    {
        path: "/cases",
        name: "Cases",
        meta: {
            requiresAuth: true
        },
        component: () =>
            import ( /* webpackChunkName: "Duyurular" */ "../views/Cases.vue")
    }
]

const router = new VueRouter({
    mode: "history",
    base: process.env.BASE_URL,
    routes
})

router.beforeEach((to, from, next) => {
    const token = window.localStorage.getItem("api_key")
    const user = window.localStorage.getItem("user")
    const lastPage = window.localStorage.getItem("last-page")
    const requiresAuth = to.matched.some((record) => record.meta.requiresAuth)
    store.state.user.isLoggedin = token ? true : false
    store.state.user.userData = user ? user : false
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