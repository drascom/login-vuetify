<template>
  <v-container class="mb-2">
    <v-navigation-drawer
      id="takım düzenle"
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
              :disabled="!city"
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
              @input="console"
            ></tags>
            <tags
              v-if="!newTeam"
              key="member"
              v-model="selectedTeam.linked"
              :list="filteredMembers"
              label="Üye Ekle"
              table="members"
              chips
              small-chips
              deletable-chips
              multiple
              :hideselection="true"
            >
            </tags>
            <v-text-field
              readonly
              v-else
              class="px-3"
              outlined
              type="text"
              placeholder="Takım  Adı"
              v-model="selectedTeam.name"
              :rules="[(v) => !!v || 'Takım Adı boş olamaz.']"
              v-uppercase
            />
          </v-card-text>
        </v-card>
      </v-container>
    </v-navigation-drawer>

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
      <v-btn :icon="$vuetify.breakpoint.xs" small color="red" class="mx-2" dark>
        <v-icon> mdi-printer </v-icon>
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
        <v-expansion-panel-header color="blue-grey lighten-4 ">
          <template v-slot:default="{ open }">
            <v-layout row wrap align-center>
              <v-flex xs8 sm5 id="name">
                <v-btn text v-ripple="{ class: 'primary--text' }" class="pl-0">
                  <v-icon left>
                    drag_indicator
                  </v-icon>
                  {{ city.name }}
                </v-btn>
              </v-flex>

              <v-flex
                xs4
                sm6
                class="pl-4 "
                :class="{ 'text-right': !$vuetify.breakpoint.xs }"
              >
                <v-fade-transition leave-absolute>
                  <span v-if="open" key="0">
                    {{
                      city.teams && city.teams.length ? city.teams.length : "0"
                    }}
                    Takım
                  </span>
                  <span v-if="!open" key="1" class="">
                    <span> {{ getMemberCount(city) }} Üye </span>
                  </span>
                </v-fade-transition>
              </v-flex>
            </v-layout>
          </template>
        </v-expansion-panel-header>
        <v-expansion-panel-content class="pa-0">
          <v-sheet color="grey lighten-2" class="">
            <v-list-item class="text-subtitle-1 ">
              <v-list-item-content>
                <v-list-item-subtitle>
                  {{ city.name }} İlinde
                  {{
                    city.teams && city.teams.length ? city.teams.length : "0"
                  }}

                  takım ve toplam {{ getMemberCount(city) }} Üye bulunmaktadır.
                </v-list-item-subtitle>
              </v-list-item-content>
              <v-list-item-action>
                <v-btn
                  small
                  color="red accent-3"
                  outlined
                  class="ma-2"
                  @click="createTeam(city)"
                >
                  <v-icon>mdi-plus</v-icon>Takım Ekle
                </v-btn>
              </v-list-item-action>
            </v-list-item>
          </v-sheet>
          <v-list dense color="transparent" class="pr-4">
            <v-list-item v-for="team in city.teams" :key="team._id">
              <v-list-item-subtitle class="text-subtitle-2">
                {{ team.name || team.display }}
                <span class="grey--text ml-4 ">
                  {{ team.linked ? team.linked.length : "0" }} Üye
                </span>
              </v-list-item-subtitle>

              <v-list-item-action class="flex-row">
                <v-btn
                  :icon="$vuetify.breakpoint.xs"
                  :small="!$vuetify.breakpoint.xs"
                  outlined
                  color="orange accent-4"
                  class=" ma-1"
                  @click="editTeam(team, city)"
                >
                  <v-icon v-if="$vuetify.breakpoint.xs">edit</v-icon>
                  <span v-else>Düzenle</span>
                </v-btn>
                <v-btn
                  :icon="$vuetify.breakpoint.xs"
                  :small="!$vuetify.breakpoint.xs"
                  outlined
                  color="red accent-4"
                  class=" ma-1"
                  @click="deleteTeam(team)"
                >
                  <v-icon v-if="$vuetify.breakpoint.xs"
                    >mdi-trash-can-outline</v-icon
                  >
                  <span v-else> Sil </span>
                </v-btn>
              </v-list-item-action>
            </v-list-item>
          </v-list>
        </v-expansion-panel-content>
      </v-expansion-panel>
    </v-expansion-panels>
  </v-container>
</template>

<script>
/* eslint-disable no-unused-vars */
/* eslint-disable vue/valid-v-slot */
import { mapActions } from "vuex"
import { mapGetters } from "vuex"
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
  team: false,
  city: false,
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
    ...mapGetters(["user", "getAll"]),
    cities() {
      return this.getAll("cities")
    },
    filteredList() {
      return this.cities.filter((item) => {
        return item.name.toLowerCase().includes(this.search.toLowerCase())
      })
    },
    filteredMembers() {
      // üye ise sadece kendi şehrinde listenelebilir admin moderator her şehirde olabilir.
      // ayrıca başka bir takıma üye olanlar listelenmez çift array karşılaştırması var !
      const results = this.members.filter((member) => {
        if (member.role == "uye") {
          return (
            member.city._id == this.city._id &&
            !this.teammember.some((item) => {
              return item.member._id == member._id
            })
          )
        }
        return this.members
        //  else {
        //   return !this.teammember.some((item) => {
        //     return item.member._id == member._id
        //   })
        // }
      })
      return results
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

    getMemberCount(city) {
      let count = 0
      city.teams.map((item) => {
        count += item.linked.length
      })
      return count
    },
    closeForm() {
      Object.assign(this.$data, defaults)
      this.city = false
      this.team = false
    },
    editTeam(team, city) {
      this.city = city
      this.team = { _id: team._id }
      this.teamEditDialog = true
    },
    editCity(item) {
      this.city = item
      this.editMode = true
      this.cityEditDialog = true
    },
    mergeTags(oldList, newList) {
      let res = newList.reduce((a, b) => {
        let a1 = oldList.find((e) => e._id === b._id) || {}
        return a.concat(Object.assign(a1, b))
      }, [])
    },
    async createTeam(city) {
      this.city = city
      let number = this.selectedCity.teams.length + 1
      this.team = {
        city: {
          _id: this.selectedCity._id,
          link: "cities",
          display: this.selectedCity.name
        },
        name: `${this.selectedCity.name} - ${number}`
      }
      await this.saveTeam()
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
        this.$store.commit("snackbar/success", "Takım Bilgisi kaydedildi")
        // sonra ilişki tablosunu kaydet
        this.saveLinkedMembers(newTeam.data)
      } else {
        this.$store.commit("snackbar/error", "Kaydedilemedi !")
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
              data: { member, team, city: this.city }
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
        child: "cities",
        data: {
          sort: { name: 1 }
        }
      })
      this.isLoading = false
      this.closeForm()
    },
    // kolleksiyondaki var olan array öğelerini değiştirme
    // async updateCityTeam(teamData) {
    //   let exist = false
    //   if (this.selectedCity.teams && this.selectedCity.teams.length > 0) {
    //     this.selectedCity.teams.map((item) => {
    //       if (item._id == teamData._id) {
    //         exist = true
    //         item.display = teamData.name
    //       }
    //     })
    //   } else {
    //     exist = true
    //   }
    //   if (!exist) {
    //     if (this.selectedCity.teams.length > 0) {
    //       console.log("team eklendi")
    //       this.selectedCity.teams.push({
    //         _id: teamData._id,
    //         link: "teams",
    //         display: teamData.name
    //       })
    //     } else {
    //       console.log("team oluşturuldu")
    //       this.selectedCity.teams = [
    //         {
    //           _id: teamData._id,
    //           link: "teams",
    //           display: teamData.name
    //         }
    //       ]
    //     }
    //   }
    //   let result = await this.save({
    //     parent: "collections",
    //     child: "cities",
    //     data: this.selectedCity
    //   })
    //   this.closeForm()
    //   result
    //     ? this.$store.commit("snackbar/success", "Takım Bilgisi kaydedildi")
    //     : this.$store.commit("snackbar/error", "Kaydedilemedi !")
    // },
    async deleteTeam(team) {
      const res = await this.$confirm(
        "Bu takımı silerseniz buraya kayıtlı üyeler takımsız olarak işaretlenecektir.",
        {
          title: "Gerçekten Silmek İstiyor musunuz ?",
          buttonTrueText: "Evet",
          buttonFalseText: "Hayır",
          color: "red"
        }
      )
      if (res) {
        this.isLoading = true
        let removeTeam = await this.delete({
          parent: "collections",
          child: "teams",
          data: { filter: { _id: team._id } }
        })

        if (removeTeam && removeTeam.data.success) {
          console.log("takım silindi")
          let members = await this.delete({
            parent: "collections",
            child: "teammember",
            data: { filter: { "team._id": team._id } }
          })
          if (members && members.data.success) {
            this.$store.commit("snackbar/info", "Takım Bilgisi silindi")
            await this.getAllItems({
              parent: "collections",
              child: "cities",
              data: {
                sort: { name: 1 }
              }
            })
            this.isLoading = false
            this.closeForm()
          }
        }
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.v-expansion-panel-content::v-deep .v-expansion-panel-content__wrap {
  padding: 0 !important;
}
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
