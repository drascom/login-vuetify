<template>
  <div>
    takım
  </div>
</template>

<script>
import { mapActions } from "vuex"

export default {
  name: "team",
  props: ["city"],
  methods: {
    ...mapActions(["getAllItems", "save", "delete"])
  },
  async beforeMount() {
    await this.getAllItems({
      parent: "collections",
      child: "cities",
      data: {
        sort: { name: 1 }
      }
    })
  }
}
</script>

<style lang="scss" scoped></style>
