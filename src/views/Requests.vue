<template>
  <div v-if="requests">
    <v-container class="">
      <v-list>
        <v-list-item-group
          v-model="selected"
          active-class="border"
          color="indigo"
        >
          <v-card v-for="item in requests" :key="item._id" class="my-2">
            <v-list-item
              class="elevation-4"
              :class="{ active: item._id === activeItem }"
              @click="setActive(item._id)"
            >
              <v-list-item-content>
                <v-list-item-title>
                  <v-icon color="blue">mdi-arrow-right</v-icon>
                  {{ item.first_city.display }}
                </v-list-item-title>
                <v-list-item-title>
                  <v-icon color="red">mdi-arrow-right</v-icon>
                  {{ item.second_city.display }}
                </v-list-item-title>
              </v-list-item-content>
              <v-list-item-content>
                <v-list-item-title>
                  <b> İşleme alan: </b
                  ><v-chip outlined> {{ item.second_city.display }} 1 </v-chip>
                </v-list-item-title>
              </v-list-item-content>
              <v-list-item-content>
                <v-list-item-subtitle>
                  <v-chip color="orange" outlined>
                    İŞLEMDE
                  </v-chip></v-list-item-subtitle
                >
              </v-list-item-content>
            </v-list-item>
            <v-slide-y-transition hide-on-leave>
              <v-card-text v-if="item._id === activeItem">
                <v-layout row wrap class="ma-2">
                  <v-flex xs12 sm3>
                    <b> Doktor : </b> {{ item.doctor_name }}
                  </v-flex>
                  <v-flex xs12 sm3> <b> Telefon: </b> {{ item.phone }} </v-flex>
                  <v-flex xs12 sm3>
                    <b> Yakınlık: </b> {{ item.relation }}
                  </v-flex>
                  <v-flex xs12>
                    <b> Hasta Bilgisi: </b> {{ item.patient_info }}
                  </v-flex>
                </v-layout>
              </v-card-text>
            </v-slide-y-transition>
          </v-card>
        </v-list-item-group>
      </v-list>
    </v-container>
  </div>
</template>

<script>
import { mapState } from "vuex"
import { mapActions } from "vuex"
import helpers from "@/plugins/helper"

export default {
  name: "Requests",
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
    ...mapState({
      requests: (state) => state.collections.requests
    })
  },
  methods: {
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
