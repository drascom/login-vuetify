<template>
  <v-container class="mb-2">
    <v-slide-y-transition hide-on-leave>
      <v-card v-if="dialog">
        <v-card-title>
          <h2 class="subheading grey--text">
            {{ editMode ? "Düzenle" : "Yeni Ekle" }}
          </h2>
          <v-spacer></v-spacer>
          <v-btn color="red" icon @click="closeForm()">
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-card-title>

        <v-card-text>
          <v-form class="px-3" ref="form">
            <v-text-field type="hidden" v-model="form.membercount" />
            <tags
              key="team"
              v-model="form.teams"
              :list="cities"
              label="Şehir Seç"
              :multi="false"
              table="cities"
            ></tags>
            <v-text-field
              type="text"
              outlined
              placeholder="Takım  Adı"
              v-model="form.name"
              prepend-inner-icon="edit"
              v-uppercase
            />
            <tags
              key="admin"
              v-model="form.admin"
              :list="members"
              label="Takım Admin"
              :multi="false"
              table="members"
            ></tags>
            <tags
              key="member"
              v-model="form.linked"
              :list="members"
              label="Üye Seç"
              table="members"
              :multi="true"
            ></tags>

            <v-list dense v-if="form.linked">
              <v-subheader>
                Kayıtlı Üyeler {{ form.linked.length }}</v-subheader
              >
              <v-list-item-group color="primary">
                <v-list-item v-for="(item, i) in form.linked" :key="i">
                  <v-list-item-icon>
                    <v-icon> mdi-account </v-icon>
                  </v-list-item-icon>
                  <v-list-item-content>
                    <v-list-item-title
                      v-text="item.display"
                    ></v-list-item-title>
                  </v-list-item-content>
                </v-list-item>
              </v-list-item-group>
            </v-list>

            <v-row class="justify-end ma-2">
              <v-btn
                elevation-6
                class="success mx-0 mt-3 "
                @click="saveTeam()"
                :loading="isLoading"
              >
                {{ editMode ? "Kaydet" : "Ekle" }}
              </v-btn>
            </v-row>
          </v-form>
        </v-card-text>
      </v-card>
    </v-slide-y-transition>

    <template v-if="!dialog">
      <v-toolbar fixed>
        <v-toolbar-title class="grey--text font-weight-bold">
          Takımlar
        </v-toolbar-title>

        <v-spacer></v-spacer>
        <v-btn
          :icon="$vuetify.breakpoint.xs"
          color="red"
          class="mx-2"
          dark
          @click="dialog = !dialog"
        >
          <v-icon :left="$vuetify.breakpoint.smAndUp"> mdi-plus </v-icon>
          {{ $vuetify.breakpoint.smAndUp ? "Ekle" : "" }}
        </v-btn>
      </v-toolbar>
      <v-text-field
        type="text"
        dense
        filled
        placeholder="Arama"
        v-model="search"
        hide-details
        prepend-inner-icon="mdi-magnify"
        single-line
      />
      <v-layout row justify-center v-if="cities.length < 1" class="pt-12">
        <v-layout column align-center>
          <span
            :class="{
              'grey--text text-h4': $vuetify.breakpoint.smAndUp,
              'grey--text text-h5 ': $vuetify.breakpoint.xsOnly
            }"
          >
            Hiç Takım bulunamadı 😔
          </span>
        </v-layout>
      </v-layout>
      <v-list v-if="cities">
        <v-card class="my-4" v-for="(item, index) in filteredList" :key="index">
          <v-list-item
            :key="index"
            class="project"
            :class="$vuetify.breakpoint.xs ? 'px-1' : ''"
            v-if="item.teams && item.teams.length"
          >
            
            <v-list-item-content>
              <v-layout row wrap class="mt-1 ml-1">
                <v-flex xs12 sm6>
                  <v-icon>
                    drag_indicator
                  </v-icon>
                  {{ item.name }}
                </v-flex>
              </v-layout>
              <v-list-item-subtitle v-if="item.teams">
                <template v-for="team in item.teams">
                  <v-chip small class="mt-4 mr-2" :key="team._id">
                    {{ team.display }}
                  </v-chip>
                </template>
              </v-list-item-subtitle>
              <v-list-item-subtitle v-else>
                <v-chip small class="mt-4 mr-2">
                  "Takım Yok."
                </v-chip>
              </v-list-item-subtitle>
            </v-list-item-content>
            <v-list-item-action class="">
              <v-list-item-action-text>
                <v-btn x-small dark color="red accent-3"  @click="newTeam(item)">Takım Ekle</v-btn>
              </v-list-item-action-text>
              <div class="d-flex flew-row">
                <v-btn icon small class="project ma-1" @click="editTeam(item)">
                  <v-icon>edit</v-icon>
                </v-btn>
                <v-btn
                  icon
                  small
                  @click="deleteItem(item)"
                  class="project ma-1"
                >
                  <v-icon>delete</v-icon>
                </v-btn>
              </div>
            </v-list-item-action>
          </v-list-item>
        </v-card>
      </v-list>
    </template>
  </v-container>
</template>

<script>
/* eslint-disable no-unused-vars */

import { mapActions } from "vuex"
import { mapState } from "vuex"

import tags from "@/components/ui/autocomplete.vue"
export default {
  name: "Teams",
  components: {
    tags
  },
  data() {
    return {
      ready: false,
      search: "",
      editMode: false,
      dialog: false,
      isLoading: false,
      form: {}
    }
  },

  methods: {
    ...mapActions(["getAllItems", "save", "delete"]),
    closeForm() {
      this.dialog = false
      this.editMode = false
      this.form = {}
    },
    editTeam(item) {
      this.form = item
      this.editMode = true
      this.dialog = true
    },
    newTeam(item){
       this.dialog = true
       
    },
    saveItem(payload) {
      return this.save(payload)
    },
    async saveTeam() {
      this.isLoading = true
      this.loadingText = "Takım kaydediliyor"

      // => linkleri leri ayrı olarak tut
      let linked = this.form.linked

      // => linkleri formdan kaldır
      this.$delete(this.form, "linked")

      //önce takımı kaydet
      let savedTeam = await this.save({
        parent: "collections",
        child: "teams",
        data: this.form
      })
      if (savedTeam) {
        this.$store.commit(
          "snackbar/success",
          savedTeam.data.name + " Kaydedildi"
        )
        this.loadingText = "Takım Kayıtları Siliniyor"
        //bu takımın eski team üye kayıtlarını sil
        let remove = await this.delete({
          parent: "collections",
          child: "teammember",
          data: { filter: { "team._id": savedTeam.data._id } }
        })
        this.loadingText = "Takımlar kaydediliyor"
        //her bir member için takım adıyla ilişki kaydet
        if (linked && linked.length >= 0) {
          let complete = await Promise.all(
            linked.map(async (item) => {
              let member = {
                _id: item._id,
                link: "members",
                display: item.display
              }
              let team = {
                _id: savedTeam.data._id,
                link: "teams",
                display: savedTeam.data.name
              }
              let result = await this.saveItem({
                parent: "collections",
                child: "teammember",
                data: { member: item, team }
              })
            })
          )
          if (complete) {
            this.getAllItems({
              parent: "collections",
              child: "teams",
              data: ""
            })
            this.$store.commit("snackbar/success", "Takım Kayıtları yenilendi.")
            this.isLoading = false
            this.loadingText = ""
          }
        }
      }
      this.isLoading = false
      this.loadingText = ""
      this.closeForm()
    },
    async deleteItem(payload) {
      const res = await this.$confirm("Gerçekten Silmek İstiyor musunuz ?", {
        title: "Uyarı",
        buttonTrueText: "Evet",
        buttonFalseText: "Hayır",
        color: "red"
      })
      if (res) {
        this.isLoading = true
        console.log(payload)
        let result = await this.delete({
          parent: "collections",
          child: "teams",
          data: payload._id
        })
        console.log("remove result", result)
        if (result && result.data.success) {
          console.log("remove success")
          this.isLoading = false
          this.closeForm()
        }
      }
    }
  },
  computed: {
    ...mapState({
      members: (state) => state.collections.members,
      teams: (state) => state.collections.teams,
      cities: (state) => state.collections.cities
    }),
    filteredList() {
      return this.cities.filter((item) => {
        return item.name.toLowerCase().includes(this.search.toLowerCase())
      })
    }
  },

  async beforeMount() {
    if (!this.cities || this.cities.length <= 0) {
      await this.getAllItems({
        parent: "collections",
        child: "cities",
        data: {
          sort: { name: 1 }
        }
      })
    }
    if (!this.teams || this.teams.length <= 0) {
      await this.getAllItems({
        parent: "collections",
        child: "teams",
        data: {
          sort: { name: 1 }
        }
      })
    }
    if (!this.members || this.members.length <= 0) {
      await this.getAllItems({
        parent: "collections",
        child: "members",
        data: ""
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.project {
  border-left: 4px solid #f83e70;
}
</style>
