<template>
  <v-app>
    <navbar></navbar>
    <v-main>
      <v-container fluid>
        <router-view :key="$route.fullPath"></router-view>
      </v-container>
    </v-main>
  </v-app>
</template>

<script>
import navbar from "@/components/core/navbar.vue"
import sidebar from "@/components/core/sidebar.vue"
export default {
  name: "App",

  components: {
    navbar,
    // eslint-disable-next-line vue/no-unused-components
    sidebar
  },

  data: () => ({
    //
  })
}
</script>
