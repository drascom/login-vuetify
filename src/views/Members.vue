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
          <v-form class="px-3" ref="form" v-model="isFormValid">
            <v-select
              :items="['Admin', 'Moderator', 'Üye']"
              label="Yetki Durumu"
              outlined
              v-model="form.role"
              filled
            ></v-select>
            <v-text-field
              type="text"
              outlined
              placeholder="İsim"
              v-model="form.name"
              prepend-inner-icon="edit"
              :rules="inputRules"
            />
            <v-text-field
              maxlength="10"
              counter="10"
              hint="0 olmadan 10 hane olarak girin"
              type="number"
              outlined
              placeholder="Telefon"
              v-model="form.phone"
              prepend-inner-icon="phone"
              :rules="inputRules"
            />
            <v-text-field
              required
              type="email"
              outlined
              placeholder="Email"
              v-model="form.email"
              prepend-inner-icon="email"
              :rules="emailRules"
            />
            <tags
              v-model="form.linked"
              :list="teams"
              label="Takımlar"
              :multi="true"
              table="team"
            ></tags>
            <v-row class="justify-end align-center ma-2">
              <v-btn
                :disabled="!isFormValid"
                elevation-6
                class="success mx-0 mt-3 "
                @click="saveMember()"
                :loading="isLoading"
              >
                {{ editMode ? "Kaydet" : "Ekle" }}
              </v-btn>
              <span v-if="loadingText" class="ml-2 mt-2 text-subtitle-1">
                {{ loadingText }}
              </span>
            </v-row>
          </v-form>
        </v-card-text>
      </v-card>
    </v-slide-y-transition>

    <template v-if="!dialog">
      <v-toolbar fixed>
        <v-toolbar-title class="grey--text font-weight-bold">
          Üyeler
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
      <v-layout row justify-center v-if="filteredList.length < 1" class="pt-12">
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
      <v-list>
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
                  {{ item.name }} ({{ item.role }})
                </v-flex>
                <v-flex xs12 sm6>
                  <v-icon small left>mdi-phone</v-icon
                  >{{ item.phone || " - Yok - " }}
                </v-flex>
              </v-layout>

              <v-list-item-subtitle v-if="item.linked" @click="editPost(item)">
                <template v-for="(link, i) in item.linked">
                  <v-chip small class="mt-4 mr-2" :key="i">
                    {{ link.display }}
                  </v-chip>
                </template>
              </v-list-item-subtitle>
              <v-list-item-subtitle v-else>
                <v-chip small class="mt-4 mr-2">
                  "Takım Üyesi Değil."
                </v-chip>
              </v-list-item-subtitle>
            </v-list-item-content>
            <v-list-item-action class="">
              <v-list-item-action-text v-if="item._created">
                {{ timestampConvert(item._created) | moment(" Do, MMMM YYYY") }}
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
import { mapState } from "vuex"
import helpers from "@/plugins/helper"
import tags from "@/components/ui/autocomplete.vue"
export default {
  name: "Members",
  components: {
    tags
  },
  data() {
    return {
      search: "",
      editMode: false,
      dialog: false,
      isLoading: false,
      isFormValid: false,
      loadingText: "",
      form: {
        name: "",
        email: "",
        password: "123456",
        role: "Üye"
      },
      memberships: [],
      inputRules: [
        (v) => !!v || "Bu alan gerekli",
        (v) => (v && v.length >= 3) || "En Az 3 Karakter Giriniz"
      ],
      emailRules: [
        (v) => !!v || "Bu alan gerekli",
        (v) =>
          !v ||
          /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(v) ||
          "E-mail geçersiz"
      ]
    }
  },

  methods: {
    ...mapActions(["getAllItems", "save", "delete"]),
    ...helpers,
    closeForm() {
      this.dialog = false
      this.editMode = false
      this.memberships = []
      this.form = {
        name: "",
        phone: "",
        email: "",
        teams: "",
        password: "123456",
        role: "Üye"
      }
    },
    editPost(item) {
      this.form = item
      this.editMode = true
      this.dialog = true
    },
    saveItem(payload) {
      return this.save(payload)
    },
    async deleteItem(payload) {
      const res = await this.$confirm("Bu Üyeyi Silmek İstiyor musunuz ?", {
        title: "Uyarı",
        buttonTrueText: "Evet",
        buttonFalseText: "Hayır",
        color: "red"
      })
      if (res) {
        this.isLoading = true
        let result = await this.delete({
          parent: "collections",
          child: "members",
          data: { filter: { _id: payload._id } }
        })
        if (result && result.data.success) {
          this.$store.commit("snackbar/success", payload.name + " Silindi")
          this.isLoading = false
          this.closeForm()
        }
      }
    },
    async saveMember() {
      this.isLoading = true
      this.loadingText = "Üye kaydediliyor"

      // => linkleri leri ayrı olarak tut
      let linked = this.form.linked

      // => linkleri formdan kaldır
      this.$delete(this.form, "linked")

      // => member kaydet
      let savedMember = await this.saveItem({
        parent: "collections",
        child: "members",
        data: this.form
      })
      if (savedMember) {
        //uyarı ver
        this.$store.commit(
          "snackbar/success",
          savedMember.data.name + " Kaydedildi"
        )
        this.loadingText = "Takım Kayıtları Siliniyor"
        // => bu üyenin eski team kayıtlarını sil
        let remove = await this.delete({
          parent: "collections",
          child: "teammember",
          data: { filter: { "member._id": savedMember.data._id } }
        })
        //her bir takım için üye adıyla ilişki kaydet
        if (linked && linked.length >= 0) {
          let complete = await Promise.all(
            linked.map(async (item) => {
              console.log("map item", item)
              let team = {
                _id: item._id,
                link: "teams",
                display: item.display
              }
              let member = {
                _id: savedMember.data._id,
                link: "members",
                display: savedMember.data.name
              }

              const result = await this.saveItem({
                parent: "collections",
                child: "teammember",
                data: { member, team }
              })
            })
          )
          if (complete) {
            this.getAllItems({
              parent: "collections",
              child: "members",
              data: ""
            })
            this.$store.commit("snackbar/success", "Takım Kayıtları yenilendi.")
          }
        }
      }
      this.isLoading = false
      this.loadingText = ""
      this.closeForm()
    }
  },
  computed: {
    ...mapState({
      members: (state) => state.collections.members,
      teams: (state) => state.collections.teams
    }),
    filteredList() {
      return this.members.filter((item) => {
        return item.name.toLowerCase().includes(this.search.toLowerCase())
      })
    }
  },
  async mounted() {
    if (!this.members || this.members.length <= 0) {
      await this.getAllItems({
        parent: "collections",
        child: "members",
        data: ""
      })
    }
    if (!this.teams || this.teams.length <= 0) {
      await this.getAllItems({
        parent: "collections",
        child: "teams",
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
