<template>
  <v-main class="overflow-hidden">
    <v-dialog v-model="newForm" fullscreen persistent>
      <form-component
        :isMember="true"
        @close-form="closeDialog"
      ></form-component>
    </v-dialog>
    <v-dialog
      transition="dialog-bottom-transition"
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
        </v-toolbar>
        <v-container fill-height v-if="selectedRequest">
          <v-layout row>
            <v-flex xs12 sm6 class="mx-auto px-2">
              <v-card shaped class="elevation-6 ma-2">
                <v-list>
                  <v-subheader>
                    <v-container fluid class="pa-0">
                      <v-card flat>
                        <v-layout row wrap justify-space-between>
                          <v-btn text small
                            ><v-icon>local_phone</v-icon>Ara</v-btn
                          >

                          <v-btn text small
                            ><v-icon>open_in_new</v-icon>Whatsapp</v-btn
                          >

                          <v-btn text small
                            ><v-icon>mdi-dots-vertical</v-icon>
                          </v-btn>
                        </v-layout>
                      </v-card>
                    </v-container>
                  </v-subheader>
                </v-list>
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
                      selectedRequest.linked &&
                        selectedRequest.linked.length == 1
                    "
                  >
                    {{ selectedRequest.linked[0].member.display }}
                  </v-chip>
                  <v-chip
                    small
                    v-if="
                      selectedRequest.linked &&
                        selectedRequest.linked.length > 1
                    "
                  >
                    <v-avatar size="5" left color="grey" class="white--text">
                      {{ selectedRequest.linked.length }}
                    </v-avatar>
                    Gönüllü
                  </v-chip>
                </template>
              </v-card>
            </v-flex>
            <v-flex xs12 sm6 class=" mx-auto">
              <v-card  class="elevation-6 ma-2">
              <message-component :_id="selectedRequest._id">
                <template v-slot:button> </template>
              </message-component>
              </v-card>
            </v-flex>
          </v-layout>
        </v-container>
      </v-card>
    </v-dialog>
    <v-container fluid grid-list-md>
      <v-item-group
        v-model="selectedRequest"
        active-class="border"
        color="indigo"
      >
        <v-layout row wrap>
          <v-flex
            xs12
            sm6
            md4
            lg3
            v-for="item in items"
            :key="item._id"
            class="pa-2"
          >
            <v-item>
              <v-card
             
                :color="
                  activeItem == item._id ? 'grey lighten-1' : 'grey lighten-3'
                "
                class="mx-auto"
                :class="{ active: item._id === activeItem }"
                @click="setActive(item)"
              >
                <v-card-title>
                  <v-chip outlined :color="JSON.parse(item.urgency).color">
                    <v-avatar
                      small
                      :color="JSON.parse(item.urgency).color"
                      class="mr-2"
                    >
                      <span class="white--text text-h5">{{
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
                  style="height: 200px;"
                >
                  {{ item.problem }}
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
                      <span class="subheading">{{ item.linked.length }}</span>
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
  props: ["new", "search", "title", "items"],
  mixins: [init],
  components: {
    formComponent: () => import("@/components/requestForm"),
    messageComponent: () => import("@/components/messages")
  },
  data() {
    return {
      newForm: false,
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
    }
  },
  methods: {
    ...helpers,
    ...mapActions(["getAllItems", "save", "delete"]),
    setMessages() {
      this.showMessages = !this.showMessages
    },
    closeDialog() {
      this.newForm = null
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
    //vazgeçmek için gönüllü olmak lazım.linked içinde member id arar
    showDismissButton(item) {
      if (item.linked) {
        return item.linked.some((v) => {
          return v.member._id === this.user._id ? true : false
        })
      }
      return false
    },
    getJob(item) {
      this.$emit("getjob", item)
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
