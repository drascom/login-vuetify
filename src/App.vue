<template>
  <v-app>
    <toastNotification></toastNotification>
    <navbar></navbar>
    <v-main>
      <v-container fluid class="pa-0">
        <transition name="fade" mode="out-in">
          <router-view :key="$route.fullPath"></router-view>
        </transition>
      </v-container>
    </v-main>
  </v-app>
</template>

<script>
import { mapGetters } from "vuex"

import Navbar from "@/components/core/navbar.vue"
import Sidebar from "@/components/core/sidebar.vue"
import toastNotification from "@/components/helper/toastNotification"
export default {
  name: "App",

  components: {
    Navbar,
    toastNotification,
    // eslint-disable-next-line vue/no-unused-components
    Sidebar
  },
  computed: {
    ...mapGetters(["user"]),
    isLoggedin() {
      return !!(this.user && this.user._id)
    },
    id() {
      return this.user._id
    }
  },
  methods: {},
  watch: {
    //member online durumunu appvue zaten yüklenmişse günceller
    isLoggedin(newValue) {
      if (newValue == true) {
        this.$store.dispatch("updateUserOnlineStatus", this.id)
        setInterval(() => {
          console.log("watch tekkrarı")
          this.$store.dispatch("updateUserOnlineStatus", this.id)
        }, 60000)
      }
    }
  },
  mounted() {
    //member online durumunu sayfa reload olunca günceller
    if (this.isLoggedin) {
      this.$store.dispatch("updateUserOnlineStatus", this.id)
      setInterval(() => {
        this.$store.dispatch("updateUserOnlineStatus", this.id)
      }, 60000)
    }
  }
}
</script>
<style>
.code input {
  text-transform: uppercase;
}
a {
  text-decoration: none;
}
</style>
