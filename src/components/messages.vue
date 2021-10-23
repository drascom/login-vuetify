<template>
  <v-container class="fill-height " fluid>
    <v-img
      height="85vh"
      src="https://github-production-user-asset-6210df.s3.amazonaws.com/15075759/28719144-86dc0f70-73b1-11e7-911d-60d70fcded21.png"
    >
      <v-row align="center" justify="center">
        <v-col cols="12" class="flex-grow-1">
          <v-card class="flex-grow-0 transparent scroll" height="77vh">
            <v-card-text>
              <v-row class="fill-height" align="end">
                <v-col>
                  <div
                    v-for="(message, index) in request.messages"
                    :key="index"
                    :class="
                      message.sender._id === user._id
                        ? 'chat__sender chat__message'
                        : 'chat__reciever chat__message'
                    "
                  >
                    <span
                      class="text-subtitle-2  green--text text--darken-4 "
                      v-if="message.sender._id !== user._id"
                    >
                      {{ message.sender.display }}
                    </span>
                    <br />
                    <span class="chat__title font-weight-bold"> {{ message.content }}</span>
                    <div class="d-flex justify-end ">
                      <v-chip small class="chat__timestamp">
                        {{ formatDate(message._modified) }}
                        <v-icon small right>done_all</v-icon></v-chip
                      >
                    </div>
                  </div>
                </v-col>
              </v-row>
            </v-card-text>
          </v-card>
          <v-card
            background-color="grey lighten-2"
            style="bottom:0px;position:absolute;"
            class="pt-2"
            width="100%"
          >
            <v-form @submit.prevent="submit">
              <v-textarea
                rounded
                outlined
                dense
                hide-details
                auto-grow
                @click:append-outer="submit"
                rows="1"
                append-outer-icon="mdi-send"
                placeholder="Mesaj yazın..."
                v-model="content"
              >
                <template slot="append-outer">
                  <v-btn color="green" class=" ml-4" icon @click="submit()">
                    <v-icon left>mdi-send</v-icon>
                  </v-btn>
                </template>
              </v-textarea>
            </v-form>
          </v-card>
        </v-col>
      </v-row>
    </v-img>
  </v-container>
</template>

<script>
import { mapGetters, mapActions } from "vuex"
import helpers from "@/plugins/helper"

export default {
  name: "messageList",
  props: ["_id"],
  data() {
    return {
      content: ""
    }
  },
  computed: {
    ...mapGetters(["user", "getOne"]),
    pageHeight() {
      return document.body.scrollHeight
    },
    request() {
      let param = { collection: "requests", id: this._id }
      return this.getOne(param)
    },
    form() {
      return {
        request: {
          _id: this.request._id,
          link: "requests",
          display: this.request.member_name.display
        },
        sender: {
          _id: this.user._id,
          link: "members",
          display: this.user.name
        },
        content: this.content
      }
    }
  },
  methods: {
    ...helpers,
    ...mapActions(["getAllItems", "save", "delete"]),
    formatDate(date) {
      let formatDate = date ? this.$moment(date * 1000) : ""
      return this.$moment(formatDate).fromNow()
    },
    async submit() {
      let result = await this.save({
        parent: "collections",
        child: "messages",
        data: this.form
      })
      if (result.statusText) {
        await this.getAllItems({
          parent: "collections",
          child: "requests",
          data: ""
        })
      } else {
        this.$store.commit("snackbar/error", "Mesaj Gönderilemedi.")
      }
      this.content = ""
      this.scrollToEnd()
    }
  },
  mounted() {}
}
</script>

<style scoped>
.scroll {
  overflow-y: scroll;
}

.chat__message {
  position: relative;
  padding: 10px;
  border-radius: 10px;
  background-color: #ffffff;
  width: fit-content;
  margin-bottom: 30px;
}
.chat__title {
  font-size: small;
}
.chat__sender:after {
  content: "";
  position: absolute;
  margin-top: -6px;
  margin-left: -5px;
  border-left: 12px solid transparent;
  border-right: 12px solid transparent;
  border-bottom: 12px solid #dcf8c6 !important;
  transform: rotate(-42deg);
  right: -10px;
  top: 4px;
}
.chat__reciever:after {
  content: "";
  position: absolute;
  margin-top: -2px;
  margin-left: -5px;
  border-left: 12px solid transparent;
  border-right: 12px solid transparent;
  border-bottom: 12px solid #ffffff !important;
  /* transform: rotate(42deg); */
  left: -6px;
  /* top: 4px; */
}
.chat__sender {
  margin-left: auto;
  background-color: #dcf8c6;
}
.chat__timestamp {
  margin-left: 10px;
  font-size: xx-small;
}

.chip-chat {
  background-color: #dcf8c6 !important;
}
</style>
