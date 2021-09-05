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
            <v-text-field
              type="text"
              outlined
              placeholder="Takım Adı"
              v-model="form.name"
              prepend-inner-icon="edit"
            />
            <v-text-field type="hidden" v-model="form.membercount" />
            <tags
              v-model="form.admin"
              :list="members"
              label="Takım Admin"
              :multi="false"
              table="members"
            ></tags>
            <tags
              v-model="memberships"
              :list="members"
              label="Üye Seç"
              table="members"
              :multi="true"
            ></tags>

            <v-list dense v-if="memberships">
              <v-subheader> Kayıtlı Üyeler {{ form.membercount }}</v-subheader>
              <v-list-item-group color="primary">
                <v-list-item v-for="(item, i) in memberships" :key="i">
                  <v-list-item-icon>
                    <v-icon> mdi-account </v-icon>
                  </v-list-item-icon>
                  <v-list-item-content>
                    <v-list-item-title
                      v-text="item.display ? item.display : item.name"
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
      <v-layout row justify-center v-if="items.length < 1" class="pt-12">
        <v-layout column align-center>
          <span
            :class="{
              'grey--text text-h4': $vuetify.breakpoint.smAndUp,
              'grey--text text-h5 ': $vuetify.breakpoint.xsOnly
            }"
          >
            Hiç Üye bulunamadı 😔
          </span>
        </v-layout>
      </v-layout>
      <v-list v-if="ready">
        <v-card class="my-4" v-for="(item, index) in filteredList" :key="index">
          <v-list-item
            :key="index"
            class="project"
            :class="$vuetify.breakpoint.xs ? 'px-1' : ''"
          >
            <v-list-item-content>
              <v-layout row wrap class="mt-1 ml-1">
                <v-flex xs12 sm6>
                  <v-icon>
                    drag_indicator
                  </v-icon>
                  {{ item.name }}
                </v-flex>
                <v-flex xs12 sm6>
                  <v-icon small left>mdi-phone</v-icon
                  >{{ item.phone || " - Yok - " }}
                </v-flex>
              </v-layout>

              <v-list-item-subtitle>
                <v-chip small class="mt-4 mr-2">
                  {{ item.membercount }} Üye
                </v-chip>
              </v-list-item-subtitle>
            </v-list-item-content>
            <v-list-item-action class="">
              <v-list-item-action-text>
                {{ item._created | moment(" Do, MMMM YYYY") }}
              </v-list-item-action-text>
              <div class="d-flex flew-row">
                <v-btn icon small class="project ma-1" @click="editPost(item)">
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
      memberships: [],
      form: {
        name: "",
        admin: {},
        membercount: ""
      }
    }
  },

  methods: {
    ...mapActions(["getAllItems", "save", "delete"]),
    async getAddition(item) {
      await this.getAllItems({
        parent: "collections",
        child: "teammember",
        data: { filter: { "team._id": item._id }, simple: "0" }
      }).then((res) => {
        this.form.membercount = res.total
        res.entries.forEach((item) => {
          this.memberships.push(item.account)
        })

        this.dialog = true
      })
    },
    closeForm() {
      this.dialog = false
      this.editMode = false
      this.memberships = []
      this.form = {
        name: "",
        admin: ""
      }
    },
    editPost(item) {
      this.getAddition(item)
      this.form = item
      this.form.membercount = this.memberships + 1
      this.editMode = true
    },
    saveItem(payload) {
      return this.save(payload)
    },
    async saveTeam() {
      this.isLoading = true
      this.loadingText = "Takım kaydediliyor"
      //önce takımı kaydet
      let teamSave = await this.save({
        parent: "collections",
        child: "teams",
        data: this.form
      })
      if (teamSave) {
        this.$store.dispatch("snackbar/setSnackbar", {
          color: "success",
          message: teamSave.data.name + " Kaydedildi"
        })
        this.isLoading = false
        this.isLoading = true
        this.loadingText = "Takım Kayıtları Siliniyor"
        //bu üyenin eski team kayıtlarını sil
        let remove = await this.delete({
          parent: "collections",
          child: "teammember",
          data: { filter: { "team._id": teamSave.data._id } }
        })
        this.isLoading = false
        this.isLoading = true
        this.loadingText = "Takımlar kaydediliyor"
        console.log("team data", teamSave)
        //her bir member için takım adıyla ilişki kaydet
        let complete = await Promise.all(
          this.memberships.map(async (item) => {
            let team = {
              _id: teamSave.data._id,
              link: "teams",
              display: teamSave.data.name
            }

            let result = await this.saveItem({
              parent: "collections",
              child: "teammember",
              data: { account: item, team }
            })
          })
        )
        if (complete) {
          this.$store.dispatch("snackbar/setSnackbar", {
            color: "success",
            message: "Takım Kayıtları yenilendi."
          })
          this.isLoading = false
          this.loadingText = ""
        }
        this.closeForm()
      }
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
    items() {
      return this.$store.getters.collections.teams
    },
    members() {
      return this.$store.getters.collections.members
    },
    filteredList() {
      return this.$store.getters.collections.teams.filter((item) => {
        return item.name.toLowerCase().includes(this.search.toLowerCase())
      })
    }
  },
  async mounted() {
    this.getAllItems({ parent: "collections", child: "members", data: "" })
    await this.getAllItems({
      parent: "collections",
      child: "teams",
      data: ""
    }).then(async (items) => {
      let ready = await Promise.all(
        items.map(async (item) => {
          const result = await this.getAllItems({
            parent: "collections",
            child: "teammember",
            data: { filter: { "team._id": item._id }, simple: "0" }
          })
          item.membercount = result.total
        })
      )
      if (ready) {
        this.ready = true
      }
    })

    // collection link  olarak alınırsa

    // tags olarak alınırsa
    // this.getAllItems({
    //   parent: "collections",
    //   child: "members",
    //   data: { filter: { teams: { $in: ["Antalya"] } } }
    // })
  }
}
</script>

<style lang="scss" scoped>
.project {
  border-left: 4px solid #f83e70;
}
</style>
