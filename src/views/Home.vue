<template>
  <v-card flat tile v-if="duyurular" :width="$vuetify.breakpoint.xs ? '100%' : '80%'" class="mx-auto">
    <card-list :posts="duyurular" />
  </v-card>
  <div v-else>Server ile bağlantı kurulamadı.</div>
</template>

<script>
import cardList from "@/components/ui/cardList"
import { mapActions } from "vuex"
export default {
  name: "Home",
  data: () => ({}),
  components: {
    // eslint-disable-next-line vue/no-unused-components
    cardList
  },
  methods: {
    ...mapActions(["getAllItems"])
  },
  computed: {
    duyurular() {
      return this.$store.getters.collections.duyurular
    }
  },
  mounted() {
    this.getAllItems({ parent: "collections", child: "duyurular", data:{sort:{_created:1}} })
  }
}
</script>
