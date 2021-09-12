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

  data: () => ({
    //
  })
}
</script>
<style>
.code input {
  text-transform: uppercase;
}
a{
 text-decoration:none;
}
</style>