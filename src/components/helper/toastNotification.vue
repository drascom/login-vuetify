<template>
  <v-snackbars :objects.sync="toasts" :distance="65" multi-line top right>
    <template v-slot:action="{ close }">
      <v-btn text @click="close()"> Kapat</v-btn>
    </template>
  </v-snackbars>
</template>

<script>
import VSnackbars from "v-snackbars"

export default {
  name: "toastNotification",

  components: {
    "v-snackbars": VSnackbars
  },
  computed: {
    toasts: {
      get() {
        return this.$store.state.snackbar.items
      },
      set(value) {
        this.$store.commit("snackbar/cleanup", value)
      }
    }
  }
}
</script>
