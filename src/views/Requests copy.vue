<template>
  <div>
    <v-dialog v-model="newForm" fullscreen persistent>
      <form-component
        :isMember="true"
        @close-form="closeDialog"
      ></form-component>
    </v-dialog>
    <v-navigation-drawer
      width="100%"
      app
      v-model="showMessages"
      right
      style="overflow: hidden;"
    >
      <message-component :_id="activeItem" v-if="showMessages">
        <template v-slot:button>
          <v-btn class="mt-n2 mr-6" icon @click="showMessages = false">
            <v-icon>mdi-arrow-left</v-icon>
          </v-btn>
        </template>
      </message-component>
    </v-navigation-drawer>
    <v-list color="transparent" class="px-0" dense subheader>
      <v-subheader>
        {{ title }}<v-spacer></v-spacer>
        <v-btn color="red" dark small @click="newForm = true" v-if="isNew">
          İstek Oluştur
        </v-btn>
      </v-subheader>
      <v-list-item-group
        dense
        v-if="items && items.length > 0"
        v-model="selectedMenu"
        active-class="border"
        color="indigo"
        class="listbox px-2"
      >
        <v-card flat tile v-for="item in items" :key="item._id" class="my-2  ">
          <v-list-item
            :two-line="$vuetify.breakpoint.xs"
            v-ripple
            class="elevation-4"
            :class="{ active: item._id === activeItem }"
            @click="setActive(item._id)"
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
              <v-chip x-small v-if="item.linked && item.linked.length == 1">
                {{ item.linked[0].member.display }}
              </v-chip>
              <v-chip small v-if="item.linked && item.linked.length > 1">
                <v-avatar size="5" left color="grey" class="white--text">
                  {{ item.linked.length }}
                </v-avatar>
                Gönüllü
              </v-chip>
            </template>
          </v-list-item>
          <v-slide-y-transition hide-on-leave>
            <v-card
              flat
              tile
              class="pa-2 mt-1"
              v-if="item._id === activeItem"
              img="https://github-production-user-asset-6210df.s3.amazonaws.com/15075759/28719144-86dc0f70-73b1-11e7-911d-60d70fcded21.png"
            >
              <v-card-text class="px-1">
                <v-layout row wrap class="ma-1">
                  <v-flex xs12 sm8 md8 class="pr-4">
                    <div class="d-flex justify-space-between text-left">
                      <span><b> Doktor : </b></span>
                      <span> {{ getMember(item.member_name._id).name }}</span>
                    </div>
                    <div class="d-flex justify-space-between">
                      <span> <b> Telefon: </b> </span>
                      <span>
                        {{ getMember(item.member_name._id).phone }}
                      </span>
                    </div>
                    <div class="d-flex justify-space-between">
                      <span> <b> Yakınlık: </b> </span>
                      <span>
                        {{ item.kinship }}
                      </span>
                    </div>
                    <div class="d-flex justify-space-between">
                      <span> <b> Hasta : </b> </span>
                      <span>
                        {{ item.patient_info }}
                      </span>
                    </div>
                    <div class="d-flex justify-space-between">
                      <span> <b> Olay Bilgisi: </b> </span>
                      <span>
                        {{ item.problem }}
                      </span>
                    </div>
                  </v-flex>
                  <v-flex sm4 md4 class="text-right">
                    <v-chip
                      class="ma-2"
                      oulined
                      color="primary"
                      pill
                      @click="setMessages(item)"
                    >
                      Mesajları Gör
                      <v-icon right>
                        mdi-account-outline
                      </v-icon>
                    </v-chip>
                  </v-flex>
                </v-layout>
              </v-card-text>

              <v-divider></v-divider>

              <v-card-actions
                light
                class="text-right"
                v-if="item._id === activeItem"
              >
                <v-chip
                  class="ma-2"
                  color="red"
                  outlined
                  pill
                  @click="deleteJob(item)"
                  v-if="showDeleteButton(item)"
                >
                  İsteği Sil
                  <v-icon right>
                    mdi-account-outline
                  </v-icon>
                </v-chip>
                <v-chip
                  class="ma-2"
                  color="blue"
                  outlined
                  pill
                  @click="recoverJob(item)"
                  v-if="showRecoverButton(item)"
                >
                  İsteği Kurtar
                  <v-icon right>
                    mdi-account-outline
                  </v-icon>
                </v-chip>
                <v-spacer></v-spacer>
                <v-chip
                  class="ma-2"
                  color="red"
                  outlined
                  pill
                  @click="dismissJob(item)"
                  v-if="showDismissButton(item)"
                >
                  Vazgeç
                  <v-icon right>
                    mdi-account-outline
                  </v-icon>
                </v-chip>
                <v-chip
                  v-else
                  outlined
                  class="ma-2"
                  color="primary"
                  pill
                  @click="getJob(item)"
                >
                  Gönüllü Ol
                  <v-icon right>
                    mdi-account-outline
                  </v-icon>
                </v-chip>
              </v-card-actions>
            </v-card>
          </v-slide-y-transition>
        </v-card>
      </v-list-item-group>
      <v-list-item v-else>
        kayıt bulunamadı
      </v-list-item>
    </v-list>
  </div>
</template>

<script>
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
      selectedMenu: {},
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
      this.selectedMenu = item
    },
    setActive(id) {
      this.activeItem = this.activeItem != id ? id : ""
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
