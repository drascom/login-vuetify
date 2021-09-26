<template>
  <v-container fluid>
    <v-toolbar dense class="mb-2 text-center ">
      <v-spacer></v-spacer>
      <v-toolbar-title class="grey--text font-weight-bold">
        <span v-if="city"></span> {{ city.name }} İli Yönetim Sayfası
      </v-toolbar-title>
      <v-spacer></v-spacer>
    </v-toolbar>
    <v-row>
      <v-col cols="12" sm="3">
        <v-navigation-drawer permanent>
          <v-sheet color="grey lighten-4" class="pa-8 text-center">
            <v-row justify="center" v-if="user">
              <v-avatar class="mb-4 " color="cyan darken-1" size="64">
                {{
                  user.name
                    .split(" ")
                    .map((x) => x[0].toUpperCase())
                    .join("")
                }}
              </v-avatar>
            </v-row>

            <v-list-item-title v-html="user.name"></v-list-item-title>
            <v-list-item-subtitle v-html="user.role"></v-list-item-subtitle>
          </v-sheet>

          <v-divider></v-divider>

          <v-list>
            <v-list-item-group v-model="selectedMenu" mandatory color="indigo">
              <v-list-item v-for="(item, i) in menuItems" :key="i">
                <v-list-item-icon>
                  <v-icon v-text="item.icon"></v-icon>
                </v-list-item-icon>

                <v-list-item-content>
                  <v-list-item-title v-text="item.text"></v-list-item-title>
                </v-list-item-content>
              </v-list-item>
            </v-list-item-group>
          </v-list>
        </v-navigation-drawer>
      </v-col>
      <v-col cols="12" sm="9">
        <v-window v-model="selectedMenu" reverse>
          <v-window-item :value="0">
            <v-card tile flat color="">
              <v-card-title v-if="isLoading">{{
                isLoading ? "yükleniyor" : ""
              }}</v-card-title>
              <requestList :cityId="searchId" @getjob="setJob" />
            </v-card>
          </v-window-item>
          <v-window-item :value="1">
            <v-card color="grey">
              <teamList :city="city" />
            </v-card>
          </v-window-item>
          <v-window-item :value="2">
            <v-card color="">
              <memberList />
            </v-card>
          </v-window-item>
        </v-window>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import init from "@/components/helper/init.vue"
import { mapState } from "vuex"
import { mapActions } from "vuex"

export default {
  name: "city",
  components: {
    teamList: () => import("./Team.vue"),
    requestList: () => import("./Requests.vue"),
    memberList: () => import("./Members.vue")
  },
  mixins: [init],
  data: () => ({
    isLoading: false,
    postedId: "",
    userCityId: "",
    searchId: "",
    errors: [],
    selectedMenu: 0,
    jobForm: {
      request: {},
      member: {}
    },
    menuItems: [
      {
        icon: "mdi-wifi",
        text: "İstekler"
      },
      {
        icon: "mdi-bluetooth",
        text: "Moderatorler"
      },
      {
        icon: "mdi-chart-donut",
        text: "Üyeler"
      }
    ]
  }),

  computed: {
    ...mapState({
      user: (state) => state.memberData
    }),
    cityAdmin() {
      return this.cities.find((item) => {
        return item.admin._id == this.user._id
      })
    },
    city() {
      let cities = this.cities.filter((item) => {
        return item._id == this.searchId
      })
      return cities.length > 0 ? cities[0] : false
    }
  },
  methods: {
    ...mapActions(["getAllItems", "save", "delete"]),

    async setJob(event) {
      this.jobForm = {
        request: {
          _id: event._id,
          link: "requests",
          display: event.doctor_name.display
        },
        member: {
          _id: this.user._id,
          link: "members",
          display: this.user.name
        }
      }
      this.isLoading = true
      let result = await this.save({
        parent: "collections",
        child: "cases",
        data: this.jobForm
      })
      if (result.statusText) {
        this.$store.commit("snackbar/success", "Görev Alındı.")
      } else {
        this.$store.commit("snackbar/error", "Bu göreve zaten gönüllüsünüz.")
      }
      this.isLoading = false
    }
  },
  mounted() {
    init
    this.postedId = this.$route.query.id
    this.userCityId = this.user.city
    this.searchId = this.postedId ? this.postedId : this.userCityId
  }
}
</script>

<style lang="scss" scoped></style>
