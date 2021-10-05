<template>
  <v-app id="inspire">
    <v-main class="grey lighten-1">
      <v-toolbar v-show="$vuetify.breakpoint.smAndUp">
        <v-toolbar-title class="py-0 ">
          İstekler Sayfası
        </v-toolbar-title>
        <v-spacer></v-spacer>
        <v-responsive max-width="380">
          <v-text-field
            outlined
            dense
            flat
            hide-details
            rounded
            solo-inverted
            placeholder="Arama"
            v-model="search"
            prepend-inner-icon="mdi-magnify"
          />
        </v-responsive>
      </v-toolbar>
      <v-toolbar v-show="$vuetify.breakpoint.xs">
        <v-btn>menu</v-btn>
        <v-text-field
          outlined
          dense
          flat
          hide-details
          rounded
          solo-inverted
          placeholder="Arama"
          v-model="search"
          prepend-inner-icon="mdi-magnify"
        />
      </v-toolbar>

      <v-container>
        <v-row>
          <v-col cols="12" sm="3">
            <v-sheet rounded="lg">
              <v-list class="mx-2">
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
                      <v-list-item-subtitle
                        v-text="item.text"
                      ></v-list-item-subtitle>
                    </v-list-item-content>
                  </v-list-item>
                </v-list-item-group>
              </v-list>
            </v-sheet>
          </v-col>
          <v-col cols="12" sm="9">
            <v-window v-model="selectedMenu" reverse>
              <v-window-item :value="0">
                <v-sheet min-height="70vh" rounded="lg" color="grey lighten-2">
                  <requestList
                    :search="search"
                    title="Benim İsteklerim"
                    :items="myRequests"
                    @getjob="setJob"
                    @dismissJob="dismissJob"
                  />
                </v-sheet>
              </v-window-item>
              <v-window-item :value="1">
                <v-sheet min-height="70vh" rounded="lg" color="grey lighten-2">
                  <requestList
                    :search="search"
                    title="Bekleyen İstekler"
                    :items="waiting"
                    @getjob="setJob"
                    @dismissJob="dismissJob"
                  />
                </v-sheet>
              </v-window-item>
              <v-window-item :value="2">
                <v-sheet min-height="70vh" rounded="lg" color="grey lighten-2">
                  <requestList
                    :search="search"
                    title="Devam Eden İstekler"
                    :items="processing"
                    @getjob="setJob"
                    @dismissJob="dismissJob"
                  />
                </v-sheet>
              </v-window-item>
              <v-window-item :value="3">
                <v-sheet min-height="70vh" rounded="lg" color="grey lighten-2">
                  <requestList
                    :search="search"
                    title="Tamamlanmış İstekler"
                    :items="completed"
                    @getjob="setJob"
                    @dismissJob="dismissJob"
                  />
                </v-sheet>
              </v-window-item>
            </v-window>
          </v-col>
        </v-row>
      </v-container>
    </v-main>
  </v-app>
</template>

<script>
/* eslint-disable vue/no-unused-components */
/* eslint-disable no-unused-vars */
import init from "@/components/helper/init.vue"
import { mapGetters } from "vuex"
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
    links: ["Anasayfa", "Mesajlar", "Profil"],
    selectedMenu: "",
    isLoading: false,
    postedId: "",
    userCityId: "",
    searchId: "",
    search: "",
    errors: [],
    jobForm: {
      request: {},
      member: {}
    },
    menuItems: [
      {
        icon: "mdi-account",
        text: "İsteklerim"
      },
      {
        icon: "mdi-format-list-checks",
        text: "Bekleyenler"
      },
      {
        icon: "mdi-progress-clock",
        text: "Devam Edenler"
      },
      {
        icon: "mdi-timeline-check-outline",
        text: "Tamamlanmış"
      }
    ]
  }),

  computed: {
    ...mapGetters(["getMember", "requests", "cases", "user"]),
    filteredList() {
      if (this.search && this.search.length > 0) {
        return this.requests.filter((item) => {
          return (
            item.first_city.display
              .toLowerCase()
              .includes(this.search.toLowerCase()) ||
            item.doctor_name.display
              .toLowerCase()
              .includes(this.search.toLowerCase())
          )
        })
      }
      return this.requests
    },
    deleted() {
      return this.filteredList.filter((item) => !item.published)
    },
    published() {
      return this.filteredList.filter((item) => item.published)
    },
    waiting() {
      return this.published.filter((item) => item.status == "waiting")
    },
    myRequests() {
      return this.published.filter(
        (item) => item.doctor_name._id == this.user._id
      )
    },
    processing() {
      return this.published.filter((item) => {
        return item.status == "processing"
      })
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
