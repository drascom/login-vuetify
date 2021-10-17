<template>
  <v-container fluid class=" grey lighten-1 pa-0 pt-1">
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
    <v-toolbar extended extension-height="60" v-show="$vuetify.breakpoint.xs">
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
      <template slot="extension" class="pa-0">
        <v-bottom-navigation
          app
          grow
          v-model="selectedMenu"
          :input-value="true"
          color="primary"
        >
          <v-badge
            :content="item.count"
            :value="item.count"
            :color="item.color"
            overlap
            v-for="(item, i) in menuItems"
            :key="`btn-${i}`"
          >
            <v-btn icon> <v-icon large v-text="item.icon"></v-icon></v-btn>
          </v-badge>
        </v-bottom-navigation>
      </template>
    </v-toolbar>
    <v-navigation-drawer
      :width="$vuetify.breakpoint.xs ? '100%' : '40%'"
      app
      v-model="showUserHome"
      right
    >
      <userhome
        :myCity="filteredCity"
        :myRequests="myRequests"
        :myMessages="myMessages"
        :userProfile="userProfile"
        :homeSubPage="homeSubPage"
      >
        <template v-slot:button>
          <v-btn icon @click="homeSubPage = 0">
            <v-icon>mdi-arrow-left</v-icon>
          </v-btn>
        </template>
        <template v-slot:title>
          {{ subPageTitle }}
        </template>
      </userhome>
    </v-navigation-drawer>
    <v-container fluid>
      <v-row>
        <v-col cols="12" sm="3" v-if="!$vuetify.breakpoint.xs">
          <v-sheet rounded="lg">
            <v-list class="mx-2 pb-8 pt-3">
              <v-list-item-group
                v-model="selectedMenu"
                mandatory
                color="primary"
              >
                <v-list-item
                  v-for="(item, i) in menuItems"
                  :key="i"
                  class="px-1"
                >
                  <v-list-item-subtitle class="black--text">
                    <v-icon v-text="item.icon" class="px-1"></v-icon>
                    {{ item.text }} ({{ item.count }})
                  </v-list-item-subtitle>
                </v-list-item>
              </v-list-item-group>
            </v-list>
          </v-sheet>
        </v-col>
        <v-col cols="12" :sm="$vuetify.breakpoint.xs ? '12' : '9'">
          <v-window v-model="selectedMenu" reverse>
            <v-window-item :value="0">
              <v-container fluid v-if="userProfile">
                <v-row justify="space-around">
                  <v-col cols="12" class="text-center ">
                    <v-sheet class="pa-6" color="grey lighten-3">
                      <h1 class="display-1 font-weight-bold mb-3">
                        Sayın {{ userProfile.name }} Hoşgeldiniz
                      </h1>
                      <p class="subheading font-weight-regular">
                        Sistemimizde {{ userProfile.city.display }} şehrinde
                        kayıtlı görünüyorsunuz.<br />
                        Şehrinizde
                        {{ filteredTeams.length }} takımda toplam
                        {{ filteredMembers.length }} kayıtlı üyemiz
                        bulunmaktadır.<br />
                      </p>
                      <v-btn
                        outlined
                        color="green"
                        text
                        @click=";(homeSubPage = 2), (subPageTitle = 'Üyeler')"
                      >
                        Şehir bilgilerini göster
                      </v-btn>
                    </v-sheet>
                  </v-col>
                  <v-col cols="12" md="4">
                    <v-card
                      class="d-flex align-center justify-center flex-column"
                      min-height="20vh"
                      rounded="lg"
                      color="grey lighten-2 text-center pa-6"
                    >
                      Toplam {{ myRequests.length }} isteginiz var.
                      <v-btn
                        small
                        color="blue"
                        text
                        @click="
                          ;(homeSubPage = 1), (subPageTitle = 'İsteklerim')
                        "
                      >
                        İsteklerimi göster
                      </v-btn>
                    </v-card>
                  </v-col>
                  <v-col cols="12" md="4">
                    <v-card
                      class="d-flex align-center justify-center flex-column"
                      min-height="20vh"
                      rounded="lg"
                      color="grey lighten-2 text-center pa-6 "
                    >
                      Toplam {{ waiting.length }} bekleyen istek var.
                      <v-btn small color="red" text @click="selectedMenu = 1">
                        İsteklerimi göster
                      </v-btn>
                    </v-card>
                  </v-col>
                  <v-col cols="12" md="4">
                    <v-card
                      class="d-flex align-center justify-center flex-column"
                      min-height="20vh"
                      rounded="lg"
                      color="grey lighten-2 text-center pa-6 "
                    >
                      Toplam {{ myMessages.length }} mesajın var.
                      <v-btn
                        small
                        color="red"
                        text
                        @click="
                          ;(homeSubPage = 3), (subPageTitle = 'Mesajlarım')
                        "
                      >
                        İsteklerimi göster
                      </v-btn>
                    </v-card>
                  </v-col>
                </v-row>
              </v-container>
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
  </v-container>
</template>

<script>
/* eslint-disable vue/no-unused-vars */
/* eslint-disable no-unused-vars */
import init from "@/components/helper/init.vue"
import { mapGetters } from "vuex"
import { mapActions } from "vuex"

export default {
  name: "UserDashboard",
  components: {
    requestList: () => import("./Requests.vue"),
    userhome: () => import("./UserHomepage.vue")
  },
  mixins: [init],
  data: () => ({
    links: ["Anasayfa", "Mesajlar", "Profil"],
    homeSubPage: 0,
    subPageTitle: "",
    selectedMenu: 0,
    isLoading: false,
    search: "",
    errors: [],
    jobForm: {
      request: {},
      member: {}
    }
  }),

  computed: {
    ...mapGetters(["getMember", "collections", "cases", "user"]),
    userProfile() {
      return this.getMember(this.user._id)
    },
    showUserHome: {
      get() {
        return this.homeSubPage != 0
      },
      set(value) {
        if (!value) {
          this.homeSubPage = 0
        }

        return value
      }
    },
    requests() {
      return this.collections("requests")
    },
    myMessages() {
      return this.collections("messages")
    },
    members() {
      return this.collections("members")
    },
    teams() {
      return this.collections("teams")
    },
    cities() {
      return this.collections("cities")
    },
    filteredCity() {
      return this.cities.filter((city) => {
        return city._id == this.user.city._id
      })
    },
    filteredTeams() {
      return this.user.linked.filter((team) => {
        return team._id == this.user.city._id
      })
    },
    filteredMembers() {
      return this.members.filter((member) => {
        return member.city._id == this.userProfile.city._id
      })
    },
    filteredList() {
      if (this.search && this.search.length > 0) {
        return this.requests.filter((item) => {
          return (
            item.first_city.display
              .toLowerCase()
              .includes(this.search.toLowerCase()) ||
            item.member_name.display
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
    processing() {
      return this.published.filter((item) => {
        return item.status == "processing"
      })
    },
    completed() {
      return this.published.filter((item) => item.status == "completed")
    },

    myRequests() {
      return this.requests.filter(
        (item) => item.member_name && item.member_name._id == this.user._id
      )
    },
    menuItems() {
      return [
        {
          icon: "mdi-account",
          text: "Anasayfa",
          count: this.myRequests.length,
          color: "cyan",
          sidebar: true
        },

        {
          icon: "mdi-format-list-checks",
          text: "Bekleyenler",
          count: this.waiting.length,
          color: "orange"
        },
        {
          icon: "mdi-progress-clock",
          text: "Devam Edenler",
          count: this.processing.length,
          color: "blue"
        },
        {
          icon: "mdi-timeline-check-outline",
          text: "Tamamlanmış",
          count: this.completed.length,
          color: "green"
        }
      ]
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
          display: event.member_name.display
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
