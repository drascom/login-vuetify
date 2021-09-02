<template>
  <v-container class="my-2">
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
            <v-card-title>Başlık </v-card-title>
            <v-text-field
              type="text"
              outlined
              placeholder="İsim"
              v-model="form.name"
              prepend-inner-icon="edit"
            ></v-text-field>
            <v-text-field
              type="text"
              outlined
              placeholder="Telefon"
              v-model="form.phone"
              prepend-inner-icon="phone"
            ></v-text-field>
            <v-text-field
              type="email"
              outlined
              placeholder="Email"
              v-model="form.email"
              prepend-inner-icon="email"
            ></v-text-field>
            <v-text-field
              outlined
              placeholder="Şifre"
              v-model="form.password"
              prepend-inner-icon="lock"
            ></v-text-field>
            <tags v-model="form.teams"></tags>
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

    <v-layout row justify-center v-if="items.length < 1">
      <v-layout column align-center>
        <span
          :class="{
            'grey--text display-3': $vuetify.breakpoint.smAndUp,
            'display-1 grey--text': $vuetify.breakpoint.xsOnly
          }"
          >Hiç Üye bulunamadı 😔</span
        >
        <v-btn flat color="primary" class="display-1" @click="dialog = !dialog"
          >Yeni Üye Ekle</v-btn
        >
      </v-layout>
    </v-layout>
    <template v-if="!dialog">
      <v-toolbar>
        <h2 class="subheading grey--text">Üyeler</h2>
        <v-spacer></v-spacer>
        <v-btn color="red" class="elevation-6" dark @click="dialog = !dialog">
          <v-icon left>mdi-plus</v-icon> Ekle
        </v-btn>
      </v-toolbar>
      <v-list>
        <v-card
          class="ml-4 my-4 py-2"
          v-for="(item, index) in items"
          :key="index"
        >
          <v-list-item :key="index" class="project" two-line>
            <v-list-item-icon>
              <v-icon>
                drag_indicator
              </v-icon>
            </v-list-item-icon>
            <v-list-item-content>
              <v-list-item-title
                @click="editPost(item)"
                class="d-flex justify-space-between"
              >
                <span> {{ item.name }}</span>
                <span
                  ><v-list-item-subtitle @click="editPost(item)">
                    <v-icon small left>mdi-phone</v-icon
                    >{{ item.phone || " - Yok - " }}
                  </v-list-item-subtitle></span
                >
              </v-list-item-title>
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
  name: "Members",
  components: {
    tags
  },
  data() {
    return {
      editMode: false,
      dialog: false,
      isLoading: false,
      form: {
        name: "",
        email: "",
        password: ""
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
        teams: ""
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
        child: "members",
        data: this.form
      })
      if (result && result.statusText) {
        this.isLoading = false
        this.closeForm()
      }
    },
    async deleteItem(payload) {
      this.isLoading = true
      console.log(payload)
      let result = await this.delete({
        parent: "collections",
        child: "members",
        data: payload._id
      })
      console.log("remove result", result)
      if (result && result.data.success) {
        console.log("remove success")
        this.isLoading = false
        this.closeForm()
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
      return this.$store.getters.collections.members
    }
  },
  mounted() {
    this.getAllItems({ parent: "collections", child: "members", data: "" })
  }
}
</script>

<style lang="scss" scoped>
.project {
  border-left: 4px solid #f83e70;
}
.theme--light.v-btn:not(.v-btn--icon).complete {
  background-color: #3cd1c2;
}
.theme--light.v-btn:not(.v-btn--icon).ongoing {
  background-color: #ffaa2c;
}
.theme--light.v-btn:not(.v-btn--icon).overdue {
  background-color: #f83e70;
}
.theme--light.v-btn.complete {
  color: #3cd1c2;
}
.theme--light.v-btn.ongoing {
  color: #ffaa2c;
}
.theme--light.v-btn.overdue {
  color: #f83e70;
}
.handle {
  cursor: move;
}
</style>
