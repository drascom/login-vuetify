<template>
  <v-container class="mb-2">
    <init></init>
    <v-slide-y-transition hide-on-leave>
      <v-card v-if="cityEditDialog">
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
            <tags
              key="city"
              v-model="city"
              :list="cities"
              label="Şehir Seç"
              table="cities"
              :disabled="disabled"
              :menu-props="{ closeOnContentClick: true }"
            ></tags>
            <v-text-field
              type="text"
              outlined
              placeholder="Takım  Adı"
              v-model="newTeamForm.name"
              prepend-inner-icon="edit"
              :rules="[(v) => !!v || 'Takım Adı boş olamaz.']"
              v-uppercase
            />
            <tags
              key="admin"
              v-model="newTeamForm.admin"
              :list="members"
              label="Takım Admin"
              :multi="false"
              table="members"
              chips
              small-chips
              :rules="[(v) => !!v || 'En Az Bir kayıt seçiniz']"
              :menu-props="{ closeOnContentClick: true }"
            ></tags>
            <tags
              key="member"
              v-model="newTeamForm.linked"
              :list="members"
              label="Üye Seç"
              table="members"
              chips
              small-chips
              deletable-chips
              multiple
              :menu-props="{ closeOnContentClick: true }"
            ></tags>
            <v-row class="justify-end ma-2">
              <v-btn
                elevation-6
                class="success mx-0 mt-3 "
                @click="saveCity()"
                :loading="isLoading"
              >
                {{ editMode ? "Kaydet" : "Ekle" }}
              </v-btn>
            </v-row>
          </v-form>
        </v-card-text>
      </v-card>
    </v-slide-y-transition>
    <v-dialog v-model="teamEditDialog" v-if="selectedTeam">
      <v-card
        class="pb-12 pt-6 mx-auto"
        :class="{ 'px-12': !$vuetify.breakpoint.xs }"
      >
        <v-card-title>
          <v-spacer></v-spacer>
          <v-btn color="red" icon @click="closeForm()">
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-card-title>

        <v-card-text>
          <v-text-field
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
            :multi="false"
            table="members"
            chips
            small-chips
            :rules="[(v) => !!v || 'En Az Bir kayıt seçiniz']"
            :menu-props="{ closeOnContentClick: true }"
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
            :menu-props="{ closeOnContentClick: true }"
            :hideselection="true"
          >
          </tags>
        </v-card-text>
        <v-card-actions>
          <v-row class="justify-end ma-2">
            <v-btn
              elevation-6
              class="success mx-0 mt-3 "
              @click="saveTeam(selectedTeam)"
              :loading="isLoading"
            >
              Kaydet
            </v-btn>
          </v-row>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <template v-if="!cityEditDialog">
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
          @click="newTeam()"
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
                  <v-btn
                    text
                    @click="
                      $router.push({ name: 'City', params: { id: item._id } })
                    "
                  >
                    {{ item.name }}
                  </v-btn>
                 <span class="grey--text text-subtitle-2 ml-8"> <b>Admin : </b> {{ item.city_admin.display}}</span>
                </v-flex>
              </v-layout>
              <v-list-item-subtitle v-if="item.teams && item.teams.length">
                <template v-for="team in item.teams">
                  <v-chip
                    small
                    class="mt-4 mr-2"
                    :key="team._id"
                    @click="editTeam(team)"
                  >
                    {{ getTeamName(team._id) }}
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
                <v-btn
                  x-small
                  dark
                  color="red accent-3"
                  @click="newTeamWithCity(item)"
                  >Takım Ekle</v-btn
                >
              </v-list-item-action-text>
              <div class="d-flex flew-row">
               <v-btn icon small class="project ma-1" @click="editCity(item)">
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
  newTeamForm: {},
  teamEditDialog: false,
  cityEditDialog: false,
  isLoading: false,
  linked: [],
  city: {},
  team: {}
}
export default {
  name: "Teams",
  components: {
    tags,
    init
  },
  data() {
    return {
      ...defaults
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
    },
    selectedCity: {
      get() {
        return this.cities.filter((item) => {
          return item._id.includes(this.city._id)
        })[0]
      },
      set(val) {
        this.city = val
      }
    },
    selectedTeam: {
      get() {
        return this.teams.filter((item) => {
          return item._id.includes(this.team._id)
        })[0]
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
    closeForm() {
      Object.assign(this.$data, defaults)
    },
    editTeam(item) {
      this.team = { _id: item._id, name: item.name }
      this.teamEditDialog = true
    },
    editCity(item) {
      this.city = { _id: item._id, name: item.name }
      this.editMode = true
      this.cityEditDialog = true
    },
    newTeam() {
      this.cityEditDialog = true
    },
    newTeamWithCity(item) {
      this.city = { _id: item._id, name: item.name }
      this.cityEditDialog = true
      this.disabled = true
    },
    async saveCity() {
      this.isLoading = true
      let newTeam = await this.saveTeam(this.newTeamForm)
      if (newTeam) {
        if (this.selectedCity.teams) {
          this.selectedCity.teams.push({
            _id: newTeam.data._id,
            link: "teams",
            display: newTeam.data.name
          })
        } else {
          this.selectedCity.teams = [
            {
              _id: newTeam.data._id,
              link: "teams",
              display: newTeam.data.name
            }
          ]
        }

        let city = await this.save({
          parent: "collections",
          child: "cities",
          data: this.selectedCity
        })
        this.isLoading = false
      }
    },
    async saveTeam(teamData) {
      // => linkleri leri ayrı olarak tut

      this.linked = teamData.linked
      // => linkleri formdan kaldır
      if (this.linked) {
        this.$delete(teamData, "linked")
      }
      //önce takımı kaydet
      let newTeam = await this.save({
        parent: "collections",
        child: "teams",
        data: teamData
      })
      // sonra ilişki tablosunu kaydet
      this.saveLinkedMembers(newTeam)
      return newTeam
    },
    async saveLinkedMembers(teamData) {
      console.log(teamData)
      // =>bu takımın eski team üye kayıtlarını sil
      let remove = await this.delete({
        parent: "collections",
        child: "teammember",
        data: { filter: { "team._id": teamData.data._id } }
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
              _id: teamData.data._id,
              link: "teams",
              display: teamData.data.name
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
</style>
