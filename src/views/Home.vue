<template>
  <div v-if="duyurular">
    <accordion-list :posts="duyurular" />
  </div>
  <div v-else>fdsfdsfsdf</div>
</template>

<script>
import accordionList from "@/components/ui/accordionList"
import { mapActions } from "vuex"
export default {
  name: "Home",
  data: () => ({}),
  components: {
    accordionList
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
    this.getAllItems({ parent: "collections", child: "duyurular", data: "" })
  }
}
</script>
