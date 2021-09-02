<template>
  <v-autocomplete
    v-model="inputVal"
    :items="items"
    outlined
    chips
    small-chips
    label="Takımlar"
    multiple
    hide-selected
    @input="update"
  ></v-autocomplete>
</template>

<script>
export default {
  name: "tags",
  props: ["value"],
  data() {
    return {
      items: ["Antalya", "Istanbul", "İzmir", "Ankara"],
      values: ["foo", "bar"]
    }
  },
  computed: {
    inputVal: {
      get() {
        return this.value
      },
      set(val) {
        this.$emit("input", val)
      }
    }
  },
  methods: {
    update(val) {
      this.$emit("input", val)
    }
  }
}
</script>

<style lang="scss" scoped></style>
