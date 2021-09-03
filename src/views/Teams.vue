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
              v-model="form.title"
              prepend-inner-icon="edit"
            />

            <tags v-model="form.members"></tags>
            <v-row class="justify-end ma-2">
              <v-btn
                elevation-6
                class="success mx-0 mt-3 "
                @click="saveItem()"
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
      ></v-text-field>
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
                  {{ item.title }}
                </v-flex>
                <v-flex xs12 sm6>
                  <v-icon small left>mdi-phone</v-icon
                  >{{ item.phone || " - Yok - " }}
                </v-flex>
              </v-layout>

              <v-list-item-subtitle @click="editPost(item)">
                <template v-for="(team, i) in item.teams">
                  <v-chip small class="mt-4 mr-2" :key="i">
                    {{ team }}
                  </v-chip>
                </template>
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
import { mapActions } from "vuex"
import tags from "@/components/ui/autocomplete.vue"
export default {
  name: "Teams",
  components: {
    tags
  },
  data() {
    return {
      search: "",
      editMode: false,
      dialog: false,
      isLoading: false,
      form: {
        name: "",
        email: "",
        password: "123456"
      }
    }
  },

  methods: {
    ...mapActions(["getAllItems", "save", "delete"]),
    submit() {
      console.log(this.form)
    },
    textUpdate(event) {
      this.form.content = event
    },
    closeForm() {
      this.dialog = false
      this.editMode = false
      this.form = {
        name: "",
        phone: "",
        email: "",
        teams: "",
        password: "123456"
      }
    },
    editPost(item) {
      this.dialog = true
      this.form = item
      this.editMode = true
    },
    async saveItem() {
      this.isLoading = true
      let result = await this.save({
        parent: "collections",
        child: "teams",
        data: this.form
      })
      if (result && result.statusText) {
        this.isLoading = false
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
  watch: {
    _by(newValue) {
      this.form._by = newValue
    }
  },
  computed: {
    items() {
      return this.$store.getters.collections.teams
    },
    filteredList() {
      return this.$store.getters.collections.teams.filter((item) => {
        return item.title.toLowerCase().includes(this.search.toLowerCase())
      })
    }
  },
  mounted() {
    this.getAllItems({ parent: "collections", child: "teams", data: "" })
    this.getAllItems({
      parent: "collections",
      child: "members",
      data: { filter: { teams: { $in: ["Antalya"] } } }
    })
  }
}
</script>

<style lang="scss" scoped>
.project {
  border-left: 4px solid #f83e70;
}
</style>
