<template>
  <div class="chat">
    <v-card class="pa-2" style="z-index:2;">
      <v-form @submit.prevent="submit">
        <v-textarea
          outlined
          hide-details
          auto-grow
          @click:append-outer="submit"
          rows="1"
          append-outer-icon="mdi-send"
          placeholder="Mesaj yazın..."
          v-model="content"
          class="mx-1"
        />
      </v-form>
    </v-card>
    <div class="chat__body" ref="chat__body">
      <div class="first__time_chat" v-if="messages && messages.length === 0">
        <p class="text-subtitle">
          Bu istekle ilgili mesaj bulunamadı.Şimdi bir mesaj yazın.
        </p>
      </div>
      <p
        v-for="(message, index) in messages"
        :key="index"
        :class="
          message.sender._id === user._id
            ? 'chat__sender chat__message'
            : 'chat__reciever chat__message'
        "
      >
        <span> {{ message.sender.display }} </span> <br />
        <span class="chat__title"> {{ message.content }}</span>
        <span class="chat__timestamp">
          {{ formatDate(message._modified) }}</span
        >
      </p>
    </div>
  </div>
</template>

<script>
import { mapGetters } from "vuex"
import { mapActions } from "vuex"
export default {
  name: "mymessages",
  props: ["messages"],
  data() {
    return {
      content: ""
    }
  },
  computed: {
    ...mapGetters(["user", "getOne"]),
    pageHeight() {
      return document.body.scrollHeight
    }
  },
  methods: {
    ...mapActions(["getAllItems", "save", "delete"]),
    scrollToEnd() {
      let container = document.querySelector(".chat__body")
      let scrollHeight = container.scrollHeight
      container.scrollTop = scrollHeight
    },
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
  mounted() {
    this.scrollToEnd()
  }
}
</script>

<style scoped>
.first__time_chat {
  padding: 8px;
  text-align: center;
  height: 70px;
  background-color: #fdf3c5;
  border-radius: 10px;
  color: #525252;
}
.no__chat_selected {
  flex: 0.65;
  margin: auto;
  text-align: center;
}
.no__chat_selected_text {
  text-align: center;
  margin-top: 10px;
}
.no__chat_selected_text > h2 {
  font-weight: 200 !important;
  font-size: 28px !important;
  color: #525252 !important;
  margin-bottom: 10px;
}
.no__chat_selected_text > span {
  color: #00000073;
}
.no__chat_selcted_img {
  width: 40%;
  border-radius: 50%;
}
.chat {
  flex: 0.65;
  display: flex;
  flex-direction: column;
  max-height: 99vh;
  overflow: auto;
}
.chat__header {
  padding: 20px;
  display: flex;
  align-items: center;
  border-bottom: 1px solid lightgrey;
}
.chat__header_info {
  flex: 1;
  padding-left: 20px;
}
.chat__header_info > h3 {
  margin-bottom: 3px;
  font-weight: bold;
}
.chat__header_info > p {
  color: gray;
}
.chat__header_right {
  display: flex;
  justify-content: center;
  min-width: 100px;
}
.chat__body {
  background-image: url("https://github-production-user-asset-6210df.s3.amazonaws.com/15075759/28719144-86dc0f70-73b1-11e7-911d-60d70fcded21.png");
  background-position: center;
  background-repeat: repeat;
  padding: 20px;
  height: 90vh;
  overflow: scroll;
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
  margin-top: -6px;
  margin-left: -5px;
  border-left: 12px solid transparent;
  border-right: 12px solid transparent;
  border-bottom: 12px solid #ffffff !important;
  transform: rotate(42deg);
  left: -6px;
  top: 4px;
}
.chat__sender {
  margin-left: auto;
  background-color: #dcf8c6;
}
.chat__timestamp {
  margin-left: 10px;
  font-size: xx-small;
}
.chat__footer {
  justify-content: space-between;
  align-items: center;
  border-top: 1px solid lightgrey;
}
.chat__footer > form {
  flex: 1;
  display: flex;
}
.chat__footer > form > input {
  flex: 1;
  border-radius: 30px;
  padding: 10px;
  border: none;
}
.emoji-invoker {
  width: 1.5rem;
  height: 1.5rem;
  border-radius: 50%;
  cursor: pointer;
  transition: all 0.2s;
}
.emoji-invoker:hover {
  transform: scale(1.1);
}
.emoji-picker {
  position: absolute;
  z-index: 1;
  font-family: Montserrat;
  border: 1px solid #ccc;
  width: 15rem;
  height: 20rem;
  overflow: scroll;
  padding-left: 30px;
  box-sizing: border-box;
  border-radius: 0.5rem;
  background: #fff;
  box-shadow: 1px 1px 8px #c7dbe6;
  padding-top: 10px;
}
.emoji-picker__search {
  display: flex;
}
.emoji-picker__search > input {
  flex: 1;
  border-radius: 10rem;
  border: 1px solid #ccc;
  padding: 0.5rem 1rem;
  outline: none;
}
.emoji-picker h5 {
  margin-bottom: 0;
  color: #b1b1b1;
  text-transform: uppercase;
  font-size: 0.8rem;
  cursor: default;
}
.emoji-picker .emojis {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
}
.emoji-picker .emojis:after {
  content: "";
  flex: auto;
}
.emoji-picker .emojis span {
  padding: 0.2rem;
  cursor: pointer;
  border-radius: 5px;
}
.emoji-picker .emojis span:hover {
  background: #ececec;
  cursor: pointer;
}
</style>
