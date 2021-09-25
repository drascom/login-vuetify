<template>
  <v-container class="mb-2">
    <v-navigation-drawer
      :stateless="true"
      v-model="cityEditDialog"
      :width="$vuetify.breakpoint.smAndDown ? '100%' : '50%'"
      height="100vh"
      fixed
      right
      disable-click-watcher
      hide-overlay
    >
      <v-container height="90vh-70px">
        <v-card v-if="cityEditDialog">
          <v-card-title>
            <h2 class="subheading grey--text">
              Düzenle
            </h2>
            <v-spacer></v-spacer>
            <v-btn color="red" icon @click="closeForm()">
              <v-icon>mdi-close</v-icon>
            </v-btn>
          </v-card-title>

          <v-card-text>
            <v-form class="px-3" ref="form">
              <v-text-field
                readonly
                type="text"
                outlined
                :value="selectedCity.name"
                prepend-inner-icon="home"
                v-uppercase
              />
              <tags
                key="admin"
                v-model="selectedCity.city_admin"
                :list="members"
                label="Takım Admin"
                :multi="false"
                table="members"
                chips
                small-chips
                :rules="[(v) => !!v || 'En Az Bir kayıt seçiniz']"
              ></tags>
              <v-divider color="cyan accent-3"></v-divider>
              <v-row class="justify-end ma-2">
                <v-btn
                  elevation-6
                  class="success mx-0 mt-3 "
                  @click="saveCity()"
                  :loading="isLoading"
                >
                  Kaydet
                </v-btn>
              </v-row>
            </v-form>
          </v-card-text>
        </v-card>
      </v-container>
    </v-navigation-drawer>
    <v-navigation-drawer
      id="takımekledegistir"
      color="grey"
      :stateless="true"
      v-model="teamEditDialog"
      :width="$vuetify.breakpoint.smAndDown ? '100%' : '40%'"
      height="100vh"
      fixed
      right
      disable-click-watcher
      hide-overlay
    >
      <v-container height="90vh-70px" v-if="selectedTeam || newTeam">
        <v-card
          class="pb-12 pt-6 mx-auto"
          :class="{ 'px-12': !$vuetify.breakpoint.xs }"
        >
          <v-card-title>
            <v-btn color="red" icon @click="closeForm()">
              <v-icon>mdi-close</v-icon>
            </v-btn>
            <v-spacer></v-spacer>
            <v-btn
              elevation-6
              class="success mx-0 mt-3 "
              @click="saveTeam(selectedTeam)"
              :loading="isLoading"
            >
              Kaydet
            </v-btn>
          </v-card-title>

          <v-card-text>
            <tags
              v-if="newTeam"
              key="city"
              v-model="city"
              :list="cities"
              label="Şehir Seç"
              table="cities"
              :disabled="disabled"
            ></tags>
            <v-text-field
              class="px-3"
              outlined
              type="text"
              placeholder="Takım  Adı"
              v-model="selectedTeam.name"
              :rules="[(v) => !!v || 'Takım Adı boş olamaz.']"
              v-uppercase
            />
            <v-divider class="mb-6"></v-divider>
            <tags
              key="admin"
              v-model="selectedTeam.admin"
              :list="members"
              label="Takım Admin"
              table="members"
              chips
              small-chips
              :rules="[(v) => !!v || 'En Az Bir kayıt seçiniz']"
            ></tags>

            <tags
              key="member"
              v-model="selectedTeam.linked"
              :list="members"
              label="Üye Ekle"
              table="members"
              chips
              small-chips
              deletable-chips
              multiple
              :hideselection="true"
            >
            </tags>
          </v-card-text>
        </v-card>
      </v-container>
    </v-navigation-drawer>
    <template>
      <v-toolbar fixed dark>
        <v-text-field
          type="text"
          dense
          solo-inverted
          placeholder="Arama"
          v-model="search"
          hide-details
          prepend-inner-icon="mdi-magnify"
          single-line
        />
        <v-spacer></v-spacer>
        <v-btn
          :icon="$vuetify.breakpoint.xs"
          small
          color="red"
          class="mx-2"
          dark
          @click="addTeam()"
        >
          <v-icon :left="$vuetify.breakpoint.smAndUp"> mdi-plus </v-icon>
          {{ $vuetify.breakpoint.smAndUp ? "Ekle" : "" }}
        </v-btn>
      </v-toolbar>
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

      <v-expansion-panels v-if="cities && cities.length > 0">
        <v-expansion-panel v-for="(city, index) in filteredList" :key="index">
          <v-expansion-panel-header>
            <template v-slot:default="{ open }">
              <v-layout row wrap align-center>
                <v-flex xs12 sm5 id="name">
                  <v-btn
                    text
                    v-ripple="{ class: 'primary--text' }"
                    class="pl-0"
                    @click="
                      $router.push({ name: 'City', query: { id: city._id } })
                    "
                  >
                    <v-icon left>
                      drag_indicator
                    </v-icon>
                    {{ city.name }}
                  </v-btn>
                  <span class="grey--text">
                    {{
                      city.teams && city.teams.length ? city.teams.length : "0"
                    }}
                    Takım
                  </span>
                </v-flex>

                <v-flex
                  xs12
                  sm6
                  class="pl-4 "
                  :class="{ 'text-right': !$vuetify.breakpoint.xs }"
                >
                  <v-fade-transition leave-absolute>
                    <span v-if="open" key="0">
                      <v-btn
                        outlined
                        color="red"
                        small
                        class=" ma-1"
                        @click="editCity(city)"
                      >
                        <v-icon small left>edit</v-icon> Düzenle
                      </v-btn>
                    </span>
                    <span v-if="!open" key="1" class=" text-subtitle-2">
                      <span v-if="city.city_admin">
                        <b>Admin : </b> {{ city.city_admin.display }}
                      </span>
                    </span>
                  </v-fade-transition>
                </v-flex>
              </v-layout>
            </template>
          </v-expansion-panel-header>
          <v-expansion-panel-content>
            <v-list>
              <v-list-item v-for="team in city.teams" :key="team._id" link>
                <v-list-item-title v-text="team.display"></v-list-item-title>
                {{ getMemberCount(team._id) }}
                <v-list-item-action class="flex-row">
                  <v-btn
                    text
                    color="orange accent-4"
                    small
                    class=" ma-1"
                    @click="editTeam(team, city)"
                  >
                    <v-icon small left>edit</v-icon> Düzenle
                  </v-btn>
                  <v-btn
                    text
                    color="red accent-4"
                    small
                    class=" ma-1"
                    @click="deleteTeam(team, city)"
                  >
                    <v-icon small left>mdi-trash-can-outline</v-icon> Sil
                  </v-btn>
                </v-list-item-action>
              </v-list-item>
            </v-list>
          </v-expansion-panel-content>
        </v-expansion-panel>
      </v-expansion-panels>
    </template>
  </v-container>
</template>

<script>
/* eslint-disable no-unused-vars */
/* eslint-disable vue/valid-v-slot */
import { mapActions } from "vuex"
import { mapState } from "vuex"
import init from "@/components/helper/init.vue"

import tags from "@/components/ui/autocomplete.vue"

const defaults = {
  search: "",
  inlineEdit: false,
  disabled: false,
  editMode: false,
  teamEditDialog: false,
  cityEditDialog: false,
  isLoading: false,
  linked: [],
  team: {},
  city: {},
  newTeam: false
}
export default {
  name: "Cities",
  mixins: [init],
  components: {
    tags
  },
  data() {
    return {
      ...defaults
    }
  },
  computed: {
    filteredList() {
      return this.cities.filter((item) => {
        return item.name.toLowerCase().includes(this.search.toLowerCase())
      })
    },
    selectedCity: {
      get() {
        if (this.city && this.city._id) {
          let result = this.cities.filter((item) => {
            return item._id.includes(this.city._id)
          })
          return result.length >= 1 ? result[0] : this.city
        }
        return this.city
      },
      set(val) {
        this.city = val
      }
    },
    selectedTeam: {
      get() {
        if (this.team && this.team._id) {
          let result = this.teams.filter((item) => {
            return item._id == this.team._id
          })
          return result.length >= 1 ? result[0] : { name: "" }
        }
        return this.team
      },
      set(val) {
        this.team = val
      }
    }
  },
  methods: {
    ...mapActions(["getAllItems", "save", "delete"]),
    getTeamName(id) {
      let finded = this.teams.filter((item) => {
        return item._id.includes(id)
      })
      if (finded && finded.length > 0) return finded[0].name
    },
    getMemberCount(id) {
      let count = this.teams.filter((obj) => obj._id === id)
      // console.log(count)
    },
    closeForm() {
      Object.assign(this.$data, defaults)
      this.city = {}
      this.team = {}
    },
    editTeam(team, city) {
      console.log("edit gelen team", team)
      this.city = city
      this.team = { _id: team._id }
      this.teamEditDialog = true
    },
    editCity(item) {
      this.city = item
      this.editMode = true
      this.cityEditDialog = true
    },
    addTeam() {
      this.newTeam = true
      // this.team = { _id: "" }
      this.teamEditDialog = true
    },
    mergeTags(oldList, newList) {
      let res = newList.reduce((a, b) => {
        let a1 = oldList.find((e) => e._id === b._id) || {}
        return a.concat(Object.assign(a1, b))
      }, [])
    },
    async saveCity() {
      this.isLoading = true
      let result = await this.save({
        parent: "collections",
        child: "cities",
        data: this.selectedCity
      })
      this.closeForm()
      result
        ? this.$store.commit("snackbar/success", "Şehir Bilgisi kaydedildi")
        : this.$store.commit("snackbar/error", "Kaydedilemedi !")
    },
    async saveTeam() {
      this.linked = this.selectedTeam.linked
      // => linkleri formdan kaldır
      if (this.linked) {
        this.$delete(this.selectedTeam, "linked")
      }
      //önce takımı kaydet
      let newTeam = await this.save({
        parent: "collections",
        child: "teams",
        data: this.selectedTeam
      })

      if (newTeam.data) {
        // sonra ilişki tablosunu kaydet
        this.saveLinkedMembers(newTeam.data)

        this.updateCityTeam(newTeam.data)
      } else {
        console.log(
          "ilişki tablosu yada şehir kaydedilemedi çünkü takım kaydedilemedi"
        )
      }
    },
    async saveLinkedMembers(teamData) {
      // =>bu takımın eski team üye kayıtlarını sil
      let remove = await this.delete({
        parent: "collections",
        child: "teammember",
        data: { filter: { "team._id": teamData._id } }
      })
      // =>her bir member için takım adıyla ilişki kaydet
      if (this.linked && this.linked.length >= 0) {
        let complete = await Promise.all(
          this.linked.map(async (item) => {
            let member = {
              _id: item._id,
              link: "members",
              display: item.display
            }
            let team = {
              _id: teamData._id,
              link: "teams",
              display: teamData.name
            }
            let result = await this.save({
              parent: "collections",
              child: "teammember",
              data: { member, team }
            })
          })
        )
      }
      this.getAllItems({
        parent: "collections",
        child: "teams",
        data: {
          sort: { name: 1 }
        }
      })
      this.getAllItems({
        parent: "collections",
        child: "teams",
        data: {
          sort: { name: 1 }
        }
      })
      this.isLoading = false
      this.closeForm()
    },
    async updateCityTeam(teamData) {
      let exist = false
      if (this.selectedCity.teams && this.selectedCity.teams.length > 0) {
        this.selectedCity.teams.map((item) => {
          if (item._id == teamData._id) {
            exist = true
            item.display = teamData.name
          }
        })
      } else {
        exist = true
      }
      if (!exist) {
        if (this.selectedCity.teams.length > 0) {
          console.log("team eklendi")
          this.selectedCity.teams.push({
            _id: teamData._id,
            link: "teams",
            display: teamData.name
          })
        } else {
          console.log("team oluşturuldu")
          this.selectedCity.teams = [
            {
              _id: teamData._id,
              link: "teams",
              display: teamData.name
            }
          ]
        }
      }
      let result = await this.save({
        parent: "collections",
        child: "cities",
        data: this.selectedCity
      })
      this.closeForm()
      result
        ? this.$store.commit("snackbar/success", "Takım Bilgisi kaydedildi")
        : this.$store.commit("snackbar/error", "Kaydedilemedi !")
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
  }
}
</script>

<style lang="scss" scoped>
.project {
  border-left: 4px solid #f83e70;
}
.v-select__selection {
  display: none;
}
::v-deep .v-select.v-input--is-dirty ::placeholder {
  color: back !important; // it's set to `transparent` by vuetify
}
#name .v-btn:hover {
  transform: scale(1.15);
}
</style>
