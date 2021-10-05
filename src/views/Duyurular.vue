<template>
  <v-container class="my-2">
    <v-slide-y-transition hide-on-leave>
      <v-card v-if="dialog">
        <v-card-title>
          <h2 class="subheading grey--text">Yeni duyuru Ekle</h2>
          <v-spacer></v-spacer>
          <v-btn color="red" icon @click="closeForm()">
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-card-title>

        <v-card-text>
          <v-form class="px-3" ref="form">
            <v-card-title>Başlık </v-card-title>
            <v-text-field
              outlined
              placeholder="Başlık yazınız"
              v-model="form.title"
              prepend-inner-icon="edit"
            ></v-text-field>
            <v-card-title>İçerik</v-card-title>
            <editor
              v-model="form.content"
              @textUpdate="textUpdate"
              class="mx-4 mx-auto"
            ></editor>
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

    <v-layout row justify-center v-if="duyurular.length < 1">
      <v-layout column align-center>
        <span
          :class="{
            'grey--text display-3': $vuetify.breakpoint.smAndUp,
            'display-1 grey--text': $vuetify.breakpoint.xsOnly
          }"
          >Hiç Duyuru eklenmedi 😔</span
        >
        <v-btn flat color="primary" class="display-1" @click="dialog = !dialog"
          >Yeni Duyuru Ekle</v-btn
        >
      </v-layout>
    </v-layout>
    <template v-if="!dialog">
      <v-toolbar>
        <h2 class="subheading grey--text">Duyurular</h2>
        <v-spacer></v-spacer>
        <v-btn color="red" class="elevation-6" dark @click="dialog = !dialog">
          <v-icon left>mdi-plus</v-icon> Ekle
        </v-btn>
      </v-toolbar>
      <v-card
        class="ml-4 my-4 py-2"
        v-for="(post, index) in duyurular"
        :key="post.title"
      >
        <v-layout row wrap class="pa-2 project">
          <v-flex xs12 md6>
            <div class="caption grey--text ml-3">Başlık</div>
            <div :class="{ 'mt-0 mb-1': $vuetify.breakpoint.smAndDown }">
              <v-icon size="20" class="handle" >
                drag_indicator
              </v-icon>
              {{ post.title }}
            </div>
          </v-flex>

          <v-flex xs5 sm6 md2>
            <div class="caption grey--text">
              {{ post._created | moment("dddd, MMMM Do YYYY") }}
            </div>
            <div :class="{ 'mt-0 mx-0 px-0': $vuetify.breakpoint.smAndDown }">
              {{ post.due }}
            </div>
          </v-flex>

          <v-flex xs3 sm3 md2 class="pt-0">
            <div class="mt-0 pt-0">
              <v-btn
                @click="changeStatus(index)"
                text
                small
                rounded
                :class="`${post.status} white--text px-0 mx-0`"
              >
                {{ post.published }}
              </v-btn>
            </div>
          </v-flex>
          <v-spacer></v-spacer>

          <v-flex xs3 sm3 md2>
            <div class="mt-0 pt-0">
              <v-btn icon class="project pa-0 ma-0" @click="editPost(post)"
                ><v-icon>edit</v-icon>
              </v-btn>
              <v-btn icon @click="deleteItem(post)" class="project pa-0 ma-0">
                <v-icon>delete</v-icon>
              </v-btn>
            </div>
          </v-flex>
        </v-layout>
      </v-card>
    </template>
  </v-container>
</template>

<script>
import { mapActions } from "vuex"
import editor from "@/components/helper/contenteditor"
export default {
  name: "Duyurular",
  components: {
    editor
  },
  data() {
    return {
      editMode: false,
      dialog: false,
      isLoading: false,
      form: {
        title: "",
        content: "",
        _by: JSON.parse(this.$store.state.user.userData)._id || ""
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
        title: "",
        content: "",
        _by: JSON.parse(this.$store.state.user.userData)._id || ""
      }
    },
    editPost(post) {
      this.dialog = true
      this.form = post
      this.editMode = true
    },
    async saveItem() {
      this.isLoading = true
      let result = await this.save({
        parent: "collections",
        child: "duyurular",
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
        child: "duyurular",
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
    duyurular() {
      return this.$store.getters.collections.duyurular
    }
  },
  mounted() {
    this.getAllItems({ parent: "collections", child: "duyurular", data: "" })
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
