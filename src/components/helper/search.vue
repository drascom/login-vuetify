<template>
  <v-text-field
    placeholder="Arama"
    :value="value"
    @input="input"
    @focus="setStatus(false)"
    @blur="setStatus(true)"
    class="expanding-search mt-3"
    :class="{ closed: searchClosed }"
    prepend-icon="searchClosed ? 'mdi-arrow-left' : ''"
    dense
    clearable
  >
    <template v-slot:prepend v-if="!searchClosed">
      <v-tooltip bottom>
        <template v-slot:activator="{ on }">
          <v-icon v-on="on">mdi-arrow-left</v-icon>
        </template>
        Close Search
      </v-tooltip>
    </template>
    <template v-slot:prepend-inner>
      <v-icon left color="red">mdi-magnify</v-icon>
    </template>
  </v-text-field>
</template>

<script>
export default {
  data() {
    return {
      searchClosed: true
    }
  },
  props: ["value", "status"],
  methods: {
    input(val) {
      this.$emit("input", val)
    },
    setStatus(status) {
      this.searchClosed = status
      this.$emit("searchStatus", status)
    }
  }
}
</script>

<style lang="sass">
.expanding-search
  transition: max-width 0.5s
  .v-input__slot
    cursor: pointer !important
    &:before, &:after
      border-color: transparent !important
  &.closed
    max-width: 50px
    .v-input__slot
      background: transparent !important
</style>
