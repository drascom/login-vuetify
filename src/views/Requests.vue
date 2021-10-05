<template>
  <div v-if="items && items.length > 0">
    <v-list  color="transparent">
      <v-subheader>{{ title }}</v-subheader>
      <v-list-item-group
        v-if="items && items.length > 0"
        v-model="selected"
        active-class="border"
        color="indigo"
        class="mx-2"
      >
        <v-card
          flat
          tile
          v-for="item in items"
          :key="item._id"
          class="my-2"
          :dark="item._id === activeItem"
        >
          <v-list-item
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
              <v-list-item-title>
                <v-icon color="blue">mdi-arrow-right</v-icon>
                {{ item.first_city.display }}
              </v-list-item-title>
            </v-list-item-content>
            <v-list-item-action>
              <v-list-item-action-text>
                <v-chip
                  x-small
                  :color="tags[item.status]"
                  outlined
                  v-if="item.published"
                >
                  {{ item.status === "waiting" ? "Bekliyor" : "İşlemde" }}
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
            </v-list-item-action>
          </v-list-item>
          <v-slide-y-transition hide-on-leave>
            <v-card flat tile>
              <v-card-text v-if="item._id === activeItem">
                <v-layout row wrap class="ma-2">
                  <v-flex xs12 class="">
                    <div class="d-flex justify-space-between text-left">
                      <span><b> Doktor : </b></span>
                      <span> {{ getMember(item.doctor_name._id).name }}</span>
                    </div>
                    <div class="d-flex justify-space-between">
                      <span> <b> Telefon: </b> </span>
                      <span>
                        {{ getMember(item.doctor_name._id).phone }}
                      </span>
                    </div>
                    <div class="d-flex justify-space-between">
                      <span> <b> Yakınlık: </b> </span>
                      <span>
                        {{ item.kinship }}
                      </span>
                    </div>
                    <div class="d-flex justify-space-between">
                      <span> <b> Hasta Bilgisi: </b> </span>
                      <span>
                        {{ item.patient_info }}
                      </span>
                    </div>
                    <div class="d-flex justify-space-between">
                      <span> <b> Olay Bilgisi: </b> </span>
                      <span>
                        {{ item.request }}
                      </span>
                    </div>
                  </v-flex>
                </v-layout>
              </v-card-text>
              <v-divider></v-divider>

              <v-card-text v-if="item._id === activeItem">
                <h5>Gönüllüler</h5>
                <v-chip-group mandatory active-class="primary--text">
                  <v-chip small v-for="(tag, i) in item.linked" :key="i">
                    {{ tag.member.display }}
                  </v-chip>
                </v-chip-group>
              </v-card-text>

              <v-card-actions class="text-right" v-if="item._id === activeItem">
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
                  class="ma-2"
                  color="primary"
                  outlined
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
    <!-- <v-list dense>
      <v-subheader>İşlemdekiler</v-subheader>
      <v-list-item-group
        v-if="processing && processing.length > 0"
        v-model="selected"
        active-class="border"
        color="indigo"
      >
        <v-card
          v-for="item in processing"
          :key="item._id"
          class="my-2"
          :dark="item._id === activeItem"
        >
          <v-list-item
            v-ripple
            :inactive="!item.published"
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
              <v-list-item-title>
                <v-icon color="blue">mdi-arrow-right</v-icon>
                {{ item.first_city.display }}
              </v-list-item-title>
            </v-list-item-content>
            <v-list-item-action>
              <v-list-item-action-text>
                <v-chip
                  x-small
                  :color="tags[item.status]"
                  outlined
                  v-if="item.published"
                >
                  {{ item.status === "waiting" ? "Bekliyor" : "İşlemde" }}
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
            </v-list-item-action>
          </v-list-item>
          <v-slide-y-transition hide-on-leave>
            <v-card flat tile>
              <v-card-text v-if="item._id === activeItem">
                <v-layout row wrap class="ma-2">
                  <v-flex xs12 class="">
                    <div class="d-flex justify-space-between text-left">
                      <span><b> Doktor : </b></span>
                      <span> {{ getMember(item.doctor_name._id).name }}</span>
                    </div>
                    <div class="d-flex justify-space-between">
                      <span> <b> Telefon: </b> </span>
                      <span>
                        {{ getMember(item.doctor_name._id).phone }}
                      </span>
                    </div>
                    <div class="d-flex justify-space-between">
                      <span> <b> Yakınlık: </b> </span>
                      <span>
                        {{ item.kinship }}
                      </span>
                    </div>
                    <div class="d-flex justify-space-between">
                      <span> <b> Hasta Bilgisi: </b> </span>
                      <span>
                        {{ item.patient_info }}
                      </span>
                    </div>
                    <div class="d-flex justify-space-between">
                      <span> <b> Olay Bilgisi: </b> </span>
                      <span>
                        {{ item.request }}
                      </span>
                    </div>
                  </v-flex>
                </v-layout>
              </v-card-text>
              <v-divider></v-divider>

              <v-card-text v-if="item._id === activeItem">
                <h5>Gönüllüler</h5>
                <v-chip-group mandatory active-class="primary--text">
                  <v-chip small v-for="(tag, i) in item.linked" :key="i">
                    {{ tag.member.display }}
                  </v-chip>
                </v-chip-group>
              </v-card-text>

              <v-card-actions class="text-right" v-if="item._id === activeItem">
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
                  class="ma-2"
                  color="primary"
                  outlined
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
    </v-list>
    <v-list v-if="user.role == 'admin'" dense>
      <v-subheader>Silinmişler</v-subheader>
      <v-list-item-group
        v-if="deleted && deleted.length > 0"
        v-model="selected"
        active-class="border"
        color="indigo"
      >
        <v-card
          v-for="item in deleted"
          :key="item._id"
          class="my-2"
          :dark="item._id === activeItem"
        >
          <v-list-item
            v-ripple
            :inactive="!item.published"
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
              <v-list-item-title>
                <v-icon color="blue">mdi-arrow-right</v-icon>
                {{ item.first_city.display }}
              </v-list-item-title>
            </v-list-item-content>
            <v-list-item-action>
              <v-list-item-action-text>
                <v-chip
                  x-small
                  :color="tags[item.status]"
                  outlined
                  v-if="item.published"
                >
                  {{ item.status === "waiting" ? "Bekliyor" : "İşlemde" }}
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
            </v-list-item-action>
          </v-list-item>
          <v-slide-y-transition hide-on-leave>
            <v-card flat tile>
              <v-card-text v-if="item._id === activeItem">
                <v-layout row wrap class="ma-2">
                  <v-flex xs12 class="">
                    <div class="d-flex justify-space-between text-left">
                      <span><b> Doktor : </b></span>
                      <span> {{ getMember(item.doctor_name._id).name }}</span>
                    </div>
                    <div class="d-flex justify-space-between">
                      <span> <b> Telefon: </b> </span>
                      <span>
                        {{ getMember(item.doctor_name._id).phone }}
                      </span>
                    </div>
                    <div class="d-flex justify-space-between">
                      <span> <b> Yakınlık: </b> </span>
                      <span>
                        {{ item.kinship }}
                      </span>
                    </div>
                    <div class="d-flex justify-space-between">
                      <span> <b> Hasta Bilgisi: </b> </span>
                      <span>
                        {{ item.patient_info }}
                      </span>
                    </div>
                    <div class="d-flex justify-space-between">
                      <span> <b> Olay Bilgisi: </b> </span>
                      <span>
                        {{ item.request }}
                      </span>
                    </div>
                  </v-flex>
                </v-layout>
              </v-card-text>
              <v-divider></v-divider>

              <v-card-text v-if="item._id === activeItem">
                <h5>Gönüllüler</h5>
                <v-chip-group mandatory active-class="primary--text">
                  <v-chip small v-for="(tag, i) in item.linked" :key="i">
                    {{ tag.member.display }}
                  </v-chip>
                </v-chip-group>
              </v-card-text>

              <v-card-actions class="text-right" v-if="item._id === activeItem">
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
                  class="ma-2"
                  color="primary"
                  outlined
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
    </v-list> -->
  </div>
</template>

<script>
import { mapGetters } from "vuex"
import { mapActions } from "vuex"
import helpers from "@/plugins/helper"
import init from "@/components/helper/init.vue"

export default {
  name: "RequestsList",
  props: ["search", "title", "items"],
  mixins: [init],
  data() {
    return {
      dialog: false,
      selected: {},
      activeItem: "",
      tags: {
        waiting: "orange",
        processing: "blue",
        completed: "green"
      }
    }
  },
  computed: {
    ...mapGetters(["getMember", "cases", "user"])
  },
  methods: {
    ...helpers,
    ...mapActions(["getAllItems", "save", "delete"]),

    //üye published olmayanları göremez
    hideRequest(item) {
      return this.user.role !== "admin" && !item.published
    },
    //zaten silinmiş item ve uye sil butonunu görmez
    showDeleteButton(item) {
      return this.user.role !== "uye" && item.published
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
      this.selected = item
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

<style lang="scss" scoped></style>
