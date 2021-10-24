<template>
  <v-main class="overflow-hidden">
    <v-dialog
      transition="dialog-bottom-transition"
      :overlay="false"
      fullscreen
      v-model="activeItem"
    >
      <v-card>
        <v-toolbar dark dense color="primary">
          <v-btn icon dark @click="activeItem = ''">
            <v-icon>mdi-close</v-icon>
          </v-btn>
          <v-toolbar-title>Detaylar</v-toolbar-title>
          <v-spacer></v-spacer>
          <v-menu transition="fade-transition">
            <template v-slot:activator="{ on, attrs }">
              <v-btn elevation-10 icon dark v-bind="attrs" v-on="on">
                <v-icon>mdi-dots-vertical</v-icon>
              </v-btn>
            </template>
            <v-list>
              <v-list-item>
                <v-list-item-title> Beklemede</v-list-item-title>
              </v-list-item>
              <v-list-item>
                <v-list-item-title> Devam Ediyor</v-list-item-title>
              </v-list-item>
              <v-list-item>
                <v-list-item-title> Tamamlandı</v-list-item-title>
              </v-list-item>
            </v-list>
          </v-menu>
        </v-toolbar>
        <v-container fill-height v-if="selectedRequest">
          <v-layout row>
            <v-flex xs12 sm6 class="mx-auto px-2">
              <v-card shaped class="elevation-6 ma-2">
                <v-list>
                  <v-subheader>
                    <v-container fluid>
                      <v-card flat>
                        <v-layout row wrap justify-space-around>
                          <a
                            :href="`tel:+${selectedRequest.phone}`"
                            v-if="selectedRequest.phone"
                          >
                            <v-btn text>
                              <v-icon left>mdi-phone </v-icon>Ara
                            </v-btn>
                          </a>
                          <v-icon v-else color="gray accent-2">
                            local-phone
                          </v-icon>
                          <a
                            :href="
                              `https://api.whatsapp.com/send?phone=${selectedRequest.phone}`
                            "
                            class="mr-3"
                            target="_blank"
                            v-if="selectedRequest.phone"
                          >
                            <v-btn text block elevation-2>
                              <v-icon left color="green accent-2">
                                mdi-whatsapp </v-icon
                              >Yaz
                            </v-btn>
                          </a>
                          <v-icon v-else color="gray " class="mr-6">
                            mdi-whatsapp
                          </v-icon>
                        </v-layout>
                      </v-card>
                    </v-container>
                  </v-subheader>
                </v-list>
                <v-divider color="primary"></v-divider>
                <v-list class="transparent">
                  <v-list-item>
                    <v-list-item-title> Doktor </v-list-item-title>
                    <v-list-item-subtitle class="text-right">
                      {{
                        selectedRequest.member_name
                          ? getMember(selectedRequest.member_name._id).name
                          : selectedRequest.applicant_name
                      }}
                    </v-list-item-subtitle>
                  </v-list-item>
                  <v-list-item>
                    <v-list-item-title> Telefon </v-list-item-title>
                    <v-list-item-subtitle class="text-right">
                      {{
                        selectedRequest.member_name
                          ? getMember(selectedRequest.member_name._id).phone
                          : selectedRequest.phone
                      }}
                    </v-list-item-subtitle>
                  </v-list-item>
                  <v-list-item>
                    <v-list-item-title> Yakınlık </v-list-item-title>
                    <v-list-item-subtitle class="text-right">
                      {{ selectedRequest.kinship }}
                    </v-list-item-subtitle>
                  </v-list-item>
                  <v-list-item>
                    <v-list-item-title> Hasta Adı </v-list-item-title>
                    <v-list-item-subtitle class="text-right">
                      {{ selectedRequest.patient_name }}
                    </v-list-item-subtitle>
                  </v-list-item>
                  <v-list-item>
                    <v-list-item-title>Olay Bilgisi </v-list-item-title>
                  </v-list-item>
                  <p class="ml-6 mr-3">{{ selectedRequest.problem }}</p>
                </v-list>
                <template>
                  <v-chip
                    x-small
                    v-if="
                      selectedRequest.volunteers &&
                        selectedRequest.volunteers.length == 1
                    "
                  >
                    {{ selectedRequest.volunteers[0].display }}
                  </v-chip>
                  <v-chip
                    small
                    v-if="
                      selectedRequest.volunteers &&
                        selectedRequest.volunteers.length > 1
                    "
                  >
                    <v-avatar size="5" left color="grey" class="white--text">
                      {{ selectedRequest.volunteers.length }}
                    </v-avatar>
                    Gönüllü
                  </v-chip>
                </template>
              </v-card>
            </v-flex>
            <v-flex xs12 sm6 class=" mx-auto">
              <v-card class="elevation-6 ma-2">
                <message-component
                  :_id="selectedRequest._id"
                  @message-sent="getJob(selectedRequest)"
                >
                  <template v-slot:button> </template>
                </message-component>
              </v-card>
            </v-flex>
          </v-layout>
        </v-container>
      </v-card>
    </v-dialog>
    <v-container fluid grid-list-md>
      <v-toolbar class="mt-n3" color="transparent" flat dense>
        <v-btn color="red">acil</v-btn>
        <v-spacer></v-spacer>
        <v-pagination
          v-show="pageCount > 1"
          circle
          v-model="pagination.page"
          :length="pageCount"
          :total-visible="6"
        >
        </v-pagination>
        <v-spacer></v-spacer>
        <v-toolbar-items>
          <v-tooltip top v-if="gridType">
            <template v-slot:activator="{ on, attrs }">
              <v-btn
                icon
                small
                dark
                v-bind="attrs"
                v-on="on"
                @click="changeGrid(10)"
              >
                <v-icon color="purple lighten-2"
                  >mdi-format-list-numbered</v-icon
                >
              </v-btn>
            </template>
            <span> Liste Görünümü</span>
          </v-tooltip>
          <v-tooltip top v-else>
            <template v-slot:activator="{ on, attrs }">
              <v-btn
                icon
                dark
                small
                v-bind="attrs"
                v-on="on"
                @click="changeGrid(4)"
              >
                <v-icon color="purple lighten-2">mdi-view-grid-outline</v-icon>
              </v-btn>
            </template>
            <span> Kart Görünümü</span>
          </v-tooltip>
        </v-toolbar-items>
      </v-toolbar>
      <v-list-item-group
        v-show="!gridType"
        dense
        v-if="items && items.length > 0"
        active-class="border"
        color="indigo"
        class="listbox"
      >
        <v-card
          flat
          tile
          v-for="item in visibleItems"
          :key="item._id"
          class="my-2  "
        >
          <v-list-item
            :two-line="$vuetify.breakpoint.xs"
            v-ripple
            class="elevation-4"
            :class="{ active: item._id === activeItem }"
            @click="setActive(item)"
            v-if="!hideRequest(item)"
          >
            <v-list-item-avatar size="50">
              <v-btn
                x-small
                outlined
                :color="JSON.parse(item.urgency).color"
                class="mx-1"
              >
                {{ JSON.parse(item.urgency).title }}
              </v-btn>
            </v-list-item-avatar>
            <v-list-item-content>
              <v-list-item-subtitle>
                <v-icon small color="blue">mdi-arrow-right</v-icon>
                {{ item.first_city.display }}
              </v-list-item-subtitle>
              <v-list-item-subtitle class="grey--text">
                Başvuran:
                {{
                  item.member_name
                    ? item.member_name.display
                    : item.applicant_name
                }}
              </v-list-item-subtitle>
            </v-list-item-content>

            <v-list-item-action-text>
              <v-chip
                x-small
                :color="statusColor[item.status]"
                outlined
                v-if="item.published"
              >
                {{ statusCode[item.status] }}
              </v-chip>
              <v-chip x-small color="red" outlined v-else>
                SILINDI
              </v-chip>
            </v-list-item-action-text>
            <template>
              <v-chip
                x-small
                v-if="item.volunteers && item.volunteers.length == 1"
              >
                {{ item.volunteers[0].display }}
              </v-chip>
              <v-chip
                small
                v-if="item.volunteers && item.volunteers.length > 1"
              >
                <v-avatar size="5" left color="grey" class="white--text">
                  {{ item.volunteers.length }}
                </v-avatar>
                Gönüllü
              </v-chip>
            </template>
          </v-list-item>
        </v-card>
      </v-list-item-group>
      <v-item-group
        v-model="selectedRequest"
        active-class="border"
        color="indigo"
        v-show="gridType"
        class="listbox"
      >
        <v-layout row wrap>
          <v-flex
            xs12
            sm6
            md4
            lg3
            v-for="item in visibleItems"
            :key="item._id"
            class="pa-2"
            transition="scroll-x-transition"
          >
            <v-item>
              <v-card
                min-width="250"
                :color="
                  activeItem == item._id ? 'grey lighten-1' : 'grey lighten-3'
                "
                class="mx-auto"
                :class="{ active: item._id === activeItem }"
                @click="setActive(item)"
              >
                <v-card-title>
                  <v-chip
                    small
                    outlined
                    :color="JSON.parse(item.urgency).color"
                  >
                    <v-avatar
                      size="25"
                      :color="JSON.parse(item.urgency).color"
                      class="mr-2"
                    >
                      <span class="white--text">{{
                        item.member_name
                          ? avatarName(JSON.parse(item.urgency).title)
                          : avatarName(JSON.parse(item.urgency).title)
                      }}</span>
                    </v-avatar>
                    {{ JSON.parse(item.urgency).title }}
                  </v-chip>
                  <v-spacer></v-spacer>
                  <v-chip
                    small
                    dark
                    :color="statusColor[item.status]"
                    v-if="item.published"
                  >
                    {{ statusCode[item.status] }}
                  </v-chip>
                  <v-chip small color="red" outlined v-else>
                    SILINDI
                  </v-chip>
                </v-card-title>
                <v-divider></v-divider>
                <v-card-actions class=" grey--text text-center">
                  <v-row justify="center">
                    {{ item.first_city.display }} ->
                    {{ item.second_city.display }}
                  </v-row>
                </v-card-actions>
                <v-divider></v-divider>
                <v-card-text
                  class="text-body-1 font-weight-light"
                  style="min-height: 100px;max-height:200"
                >
                  {{ truncate(item.problem, 90, "...") }}
                </v-card-text>

                <v-card-actions>
                  <v-list-item class="grow px-0">
                    <v-list-item-avatar color="grey darken-3">
                      <v-img
                        class="elevation-6"
                        alt=""
                        src="https://avataaars.io/?avatarStyle=Transparent&topType=ShortHairShortCurly&accessoriesType=Prescription02&hairColor=Black&facialHairType=Blank&clotheType=Hoodie&clotheColor=White&eyeType=Default&eyebrowType=DefaultNatural&mouthType=Default&skinColor=Light"
                      ></v-img>
                    </v-list-item-avatar>

                    <v-list-item-content>
                      <v-list-item-title>
                        {{
                          item.member_name
                            ? item.member_name.display
                            : item.applicant_name
                        }}
                      </v-list-item-title>
                    </v-list-item-content>
                    <v-list-item-action>
                      {{ item._created | moment("DD, MMM/YY") }}
                    </v-list-item-action>
                  </v-list-item>
                </v-card-actions>
                <v-divider></v-divider>
                <v-card-actions>
                  <v-list-item class="grow">
                    <v-row align="center" justify="space-between">
                      <v-icon class="mr-1">
                        mdi-chat-processing-outline
                      </v-icon>
                      <span class="subheading mr-1">{{
                        item.messages.length
                      }}</span>
                      <span class="mr-1">·</span>
                      <v-icon class="mr-1">
                        mdi-share-variant
                      </v-icon>
                      <span class="subheading">{{
                        item.volunteers.length
                      }}</span>
                      <span class="text-caption ml-4">
                        {{ $moment(item._created * 1000).fromNow() }}
                      </span>
                    </v-row>
                  </v-list-item>
                </v-card-actions>
              </v-card>
            </v-item>
          </v-flex>
        </v-layout>
      </v-item-group>
    </v-container>
  </v-main>
</template>

<script>
/* eslint-disable vue/no-unused-components */

import { mapGetters } from "vuex"
import { mapActions } from "vuex"
import helpers from "@/plugins/helper"
import init from "@/components/helper/init.vue"

export default {
  name: "RequestsList",
  props: {
    new: Boolean,
    search: String,
    title: String,
    items: Array,
    gridType: { type: Boolean, default: true }
  },
  mixins: [init],
  components: {
    messageComponent: () => import("@/components/messages")
  },
  data() {
    return {
      pagination: {
        page: 1,
        perPage: 4
      },
      showMessages: false,
      selectedRequest: null,
      activeItem: "",
      statusColor: {
        waiting: "orange",
        processing: "blue",
        completed: "green"
      },
      statusCode: {
        waiting: "Bekliyor",
        processing: "İşlemde",
        completed: "Tamamlandı"
      }
    }
  },
  computed: {
    ...mapGetters(["getMember", "collections", "user"]),
    isNew() {
      return this.new
    },
    pageCount() {
      return Math.ceil(this.items.length / this.pagination.perPage)
    },
    visibleItems() {
      return this.items.slice(
        (this.pagination.page - 1) * this.pagination.perPage,
        this.pagination.page * this.pagination.perPage
      )
    }
  },
  methods: {
    ...helpers,
    ...mapActions(["getAllItems", "save", "delete"]),
    setMessages() {
      this.showMessages = !this.showMessages
    },
    changeGrid(value) {
      this.gridType = !this.gridType
      this.pagination.perPage = value
    },

    //üye published olmayanları göremez
    hideRequest(item) {
      return this.user.role !== "admin" && !item.published
    },
    //zaten silinmiş item ve uye sil butonunu görmez
    showDeleteButton(item) {
      return (
        (this.user.role !== "uye" && item.published) ||
        item.member_name._id === this.user._id
      )
    },
    // admin ve silinmiş üye recover butonunu görür
    showRecoverButton(item) {
      return this.user.role == "admin" && !item.published
    },
    //vazgeçmek için gönüllü olmak lazım.volunteers içinde member id arar
    showDismissButton(item) {
      if (item.volunteers) {
        return item.volunteers.some((v) => {
          return v.member._id === this.user._id ? true : false
        })
      }
      return false
    },
    getJob(item) {
      let usernameCheck = item.volunteers
        .map((u) => u._id)
        .includes(this.user._id)
      if (!usernameCheck) {
        this.$emit("getjob", item)
      }
    },
    dismissJob(item) {
      this.$emit("dismissJob", item)
    },
    // array içinde array karşılaştır eşleşeni bul
    // getRequestCases(request, type) {
    //   let found = this.cases.filter((item) => {
    //     return item.request._id == request._id
    //   })
    //   if (type == "isim") {
    //     return found && found.length > 0 ? found[0].member.display : null
    //   } else if (type == "liste") {
    //     return found
    //   }
    //   return null
    // },

    handleClick(item) {
      this.dialog = true
      this.selectedRequest = item
    },
    setActive(item) {
      this.activeItem = this.activeItem._id != item._id ? item._id : ""
      this.selectedRequest = item
    }
  },
  async mounted() {
    this.init
  }
}
</script>

<style lang="scss" scoped>
.listbox {
  background-image: url("https://github-production-user-asset-6210df.s3.amazonaws.com/15075759/28719144-86dc0f70-73b1-11e7-911d-60d70fcded21.png");
  background-position: center;
  background-repeat: repeat;
  height: 80vh;
  overflow-y: scroll;
}
</style>
