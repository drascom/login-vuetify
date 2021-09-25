<template>
  <div v-if="requests">
    <v-container class="">
      <v-list>
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
            >
              <v-avatar
                left
                class="ma-4 white--text"
                :color="goster(item.urgency).color"
                size="30"
              >
                {{ goster(item.urgency).title }}
              </v-avatar>
              <v-list-item-content>
                <v-list-item-title>
                  <v-icon color="blue">mdi-arrow-right</v-icon>
                  {{ item.first_city.display }}
                </v-list-item-title>
              </v-list-item-content>
              <v-list-item-content>
                <v-list-item-title>
                  <b> İşleme alan: </b>
                  <v-chip outlined>
                    --
                  </v-chip>
                </v-list-item-title>
              </v-list-item-content>
              <v-list-item-avatar right vertical>
                <v-list-item-subtitle>
                  <v-chip color="orange" outlined>
                    Bekliyor
                  </v-chip></v-list-item-subtitle
                >
              </v-list-item-avatar>
            </v-list-item>
            <v-slide-y-transition hide-on-leave>
              <v-card flat tile>
                <v-card-text v-if="item._id === activeItem">
                  <v-layout row wrap class="ma-2">
                    <v-flex xs12 sm4>
                      <b> Doktor : </b>
                      {{ getMember(item.doctor_name._id).name }}
                    </v-flex>
                    <v-flex xs12 sm3>
                      <b> Telefon: </b>
                      {{ getMember(item.doctor_name._id).phone }}
                    </v-flex>
                    <v-flex xs12 sm3>
                      <b> Yakınlık: </b> {{ item.kinship }}
                    </v-flex>
                    <v-flex xs12>
                      <b> Hasta Bilgisi: </b> {{ item.patient_info }}
                    </v-flex>
                    <v-flex xs12>
                      <b> Olay Bilgisi: </b> {{ item.request }}
                    </v-flex>
                  </v-layout>
                </v-card-text>
                <v-card-actions v-if="item._id === activeItem">
                  <v-btn dark color="green accent-2" elevayion="4">Gönüllü Ol </v-btn>
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

export default {
  name: "Requests",
  props: ["cityId"],
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
    ...mapGetters(["getMember", "requests"]),
    cityRequests() {
      return this.requests.filter((item) => {
        return item.second_city._id == this.cityId
      })
    }
  },
  methods: {
    goster(item) {
      return JSON.parse(item)
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
    await this.getAllItems({
      parent: "collections",
      child: "requests",
      data: {
        sort: { name: 1 }
      }
    })
  }
}
</script>

<style lang="scss" scoped></style>
