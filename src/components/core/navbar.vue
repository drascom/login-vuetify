<template>
  <div>
    <v-app-bar dense v-if="isLoggedin">
      <v-app-bar-nav-icon
        @click="$router.push('/dashboard')"
      ></v-app-bar-nav-icon>

      <v-toolbar-title>Sayın {{ user.name }} hoşgeldin</v-toolbar-title>

      <v-spacer></v-spacer>
      <v-chip x-small outlined color="blue">Yetki : {{ user.role }} </v-chip>
      <div class="text-center">
        <v-menu offset-y rounded="lg">
          <template v-slot:activator="{ on, attrs }">
            <v-btn icon v-bind="attrs" v-on="on">
              <v-icon>mdi-dots-vertical</v-icon>
            </v-btn>
          </template>

          <v-list>
            <v-list-item @click="$router.push('/dashboard')">
              <v-list-item-title> Anasayfa </v-list-item-title>
            </v-list-item>
            <v-list-item @click="$router.push('/duyurular')">
              <v-list-item-title> Duyurular </v-list-item-title>
            </v-list-item>
            <v-list-item @click="$router.push('/teams')">
              <v-list-item-title> Takımlar </v-list-item-title>
            </v-list-item>
            <v-list-item @click="$router.push('/members')">
              <v-list-item-title> Üyeler </v-list-item-title>
            </v-list-item>
            <v-list-item @click="doLogout()">
              <v-list-item-title>Çıkış</v-list-item-title>
            </v-list-item>
          </v-list>
        </v-menu>
      </div>
    </v-app-bar>

    <v-app-bar v-else dark src="https://picsum.photos/1920/1080?random">
      <template v-slot:img="{ props }">
        <v-img
          v-bind="props"
          gradient="to top right, rgba(100,115,201,.7), rgba(25,32,72,.7)"
        ></v-img>
      </template>

      <v-spacer></v-spacer>
      <!-- <v-btn text @click="goToHome()" v-if="$route.fullPath == '/login'">
        <v-icon left>mdi-home</v-icon>AnaSayfa
      </v-btn>
      <v-btn text @click="goToLogin()" v-else>
        <v-icon left>mdi-account</v-icon>Giriş
      </v-btn> -->
    </v-app-bar>
  </div>
</template>

<script>
import { mapMutations } from "vuex"
import { mapGetters } from "vuex"
export default {
  name: "navBar",
  computed: {
    ...mapGetters(["isLoggedin", "user"])
  },
  methods: {
    ...mapMutations(["logout"]),
    goToLogin() {
      this.$router.push("/login")
    },
    goToHome() {
      this.$router.push("/")
    },
    doLogout() {
      this.logout()
      this.$router.push("/")
    }
  }
}
</script>

<style lang="scss" scoped></style>
