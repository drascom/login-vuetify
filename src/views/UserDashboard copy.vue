<template>
  <v-container fluid class="full-height">
    <v-toolbar dense class="mb-2 text-center ">
      <v-spacer></v-spacer>
      <v-toolbar-title class="grey--text font-weight-bold">
        <span v-if="city"></span> {{ city.name }} Bilgi sayfası
      </v-toolbar-title>
      <v-spacer></v-spacer>
    </v-toolbar>
    <v-container fluid class="full-height">
      <v-row class="fill-height">
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
              <v-list-item-group
                v-model="selectedMenu"
                mandatory
                color="indigo"
              >
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
        <v-col cols="12" sm="9" class="pa-0">
          <v-sheet color="red" class="pa-6">
            <v-window v-model="selectedMenu" reverse>
              <v-window-item :value="0">
                <v-card tile flat color="">
                  <v-toolbar dense fixed flat>
                    <v-text-field
                      outlined
                      type="text"
                      dense
                      placeholder="Arama"
                      v-model="search"
                      hide-details
                      prepend-inner-icon="mdi-magnify"
                      single-line
                    />
                  </v-toolbar>

                  <v-card-title v-if="isLoading">{{
                    isLoading ? "yükleniyor" : ""
                  }}</v-card-title>

                  <requestList
                    :search="search"
                    @getjob="setJob"
                    @dismissJob="dismissJob"
                  />
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
              </v-window-item> </v-window
          ></v-sheet>
        </v-col>
      </v-row>
    </v-container>
  </v-container>
</template>

<script>
/* eslint-disable no-unused-vars */
import init from "@/components/helper/init.vue"
import { mapState } from "vuex"
import { mapActions } from "vuex"

export default {
  name: "UserDashboard",
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
    search: "",
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

    async dismissJob(item) {
      let index = ""
      let findCase = item.linked.map((v, i) => {
        index = i
        return v.member._id == this.user._id ? v._id : ""
      })
      item.linked.splice(index, 1)
      await this.delete({
        parent: "collections",
        child: "cases",
        data: { filter: { _id: findCase[0] } }
      })
      this.$store.commit("snackbar/success", "Görev Silindi.")
      let status = item.linked.length <= 0 ? "waiting" : ""
      this.updateRequestStatus(item, status)
    },
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
        this.updateRequestStatus(event, "processing")
      } else {
        this.$store.commit("snackbar/error", "Bu göreve zaten gönüllüsünüz.")
      }
      this.isLoading = false
    },
    async updateRequestStatus(item, status) {
      if (item.status !== "completed") {
        await this.save({
          parent: "collections",
          child: "requests",
          data: {
            _id: item._id,
            status: status
          }
        })
      }
    }
  },
  mounted() {
    init
  }
}
</script>

<style lang="scss" scoped></style>
