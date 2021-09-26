<template>
  <div v-if="requests">
    <v-container class="">
      <v-list dense>
        <v-list-item-group
          v-model="selected"
          active-class="border"
          color="indigo"
        >
          <v-card v-for="item in cityRequests" :key="item._id" class="my-2">
            <v-list-item
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
                    :color="getRequestCases(item, 'isim') ? 'green' : 'red'"
                    outlined
                  >
                    {{ getRequestCases(item, "isim") ? "İşlemde" : "Bekliyor" }}
                  </v-chip>
                </v-list-item-action-text>
                <v-chip x-small v-if="getRequestCases(item, 'isim')">
                  {{ getRequestCases(item, "isim") }}</v-chip
                >
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
                    <v-chip
                      small
                      v-for="tag in getRequestCases(item, 'liste')"
                      :key="tag"
                    >
                      {{ tag.member.display }}
                    </v-chip>
                  </v-chip-group>
                </v-card-text>

                <v-card-actions
                  class="text-right"
                  v-if="item._id === activeItem"
                >
                  <v-chip
                    class="ma-2"
                    color="red"
                    outlined
                    pill
                    @click="deleteJob(item)"
                    v-if="!hideDeleteButton()"
                  >
                    İsteği Sil
                    <v-icon right>
                      mdi-account-outline
                    </v-icon>
                  </v-chip>
                  <v-chip
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
    </v-container>
  </div>
</template>

<script>
import { mapGetters } from "vuex"
import { mapActions } from "vuex"
import helpers from "@/plugins/helper"
import init from "@/components/helper/init.vue"

export default {
  name: "Requests",
  props: ["cityId"],
  mixins: [init],
  data() {
    return {
      search: "",
      dialog: false,
      selected: {},
      activeItem: "",
      tags: [
        ["Beklemede", "red"],
        ["İşlemde", "orange"],
        ["Sonuçlandı", "green"]
      ]
    }
  },
  computed: {
    ...mapGetters(["getMember", "requests", "cases", "user"]),
    cityRequests() {
      return this.requests.filter((item) => {
        return item.second_city._id == this.cityId
      })
    }
  },
  methods: {
    hideRequest(item) {
      return this.user.role == "uye" && !item.published
    },
    hideDeleteButton() {
      return this.user.role == "uye"
    },
    getJob(item) {
      this.$emit("getjob", item)
    },
    getRequestCases(request, type) {
      let found = this.cases.filter((item) => {
        return item.request._id == request._id
      })
      if (type == "isim") {
        return found && found.length > 0 ? found[0].member.display : null
      } else if (type == "liste") {
        return found
      }
      return null
    },
    ...helpers,
    ...mapActions(["getAllItems", "save", "delete"]),
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
