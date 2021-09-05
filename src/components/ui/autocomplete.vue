<template>
  <v-autocomplete
    v-model="selectedValue"
    :items="list"
    item-value="display"
    item-text="name"
    outlined
    chips
    close
    small-chips
    :label="label"
    :multiple="multi"
    return-object
    hide-selected
    :rules="[(v) => !!v || 'En Az Bir kayıt seçiniz']"
  >
    <template v-slot:selection="data">
      <v-chip
        v-bind="data.attrs"
        :input-value="data.selected"
        close
        @click="data.select"
        @click:close="remove(data.index)"
      >
        {{ data.item.name }}
      </v-chip>
    </template>
  </v-autocomplete>
</template>

<script>
export default {
  name: "tags",
  props: ["value", "list", "label", "multi", "table"],
  data() {
    return {
      inputVal: this.value || null
    }
  },
  computed: {
    selectedValue: {
      get() {
        return this.inputVal ? this.inputVal : null
      },
      set(val) {
        let sendBack = []
        val.forEach((item) => {
          sendBack.push({
            _id: item._id,
            link: this.table,
            display: item.name
          })
        })

        this.$emit("input", val)
        // this.inputVal = sendBack
      }
    }
  },
  methods: {
    remove(index) {
      if (index >= 0) this.inputVal.splice(index, 1)
    }
  }
}
</script>

<style lang="scss" scoped></style>
