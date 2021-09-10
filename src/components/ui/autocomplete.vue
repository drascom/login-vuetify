<template>
  <v-autocomplete
    v-model="selectedValue"
    :items="list"
    item-value="display"
    item-text="name"
    outlined
    chips
    small-chips
    deletable-chips
    :label="label"
    :multiple="multi"
    return-object
    hide-selected
    :rules="required ? [(v) => !!v || 'En Az Bir kayıt seçiniz'] : []"
  >
  </v-autocomplete>
</template>

<script>
export default {
  name: "tags",
  props: ["value", "list", "label", "multi", "table", "required"],
  data() {
    return {
      inputVal: this.value
    }
  },
  computed: {
    selectedValue: {
      get() {
        return this.inputVal ? this.inputVal : null
      },
      set(val) {
        let sendBack = []
        if (val.length > 0) {
          val.forEach((item) => {
            sendBack.push({
              _id: item._id,
              link: this.table,
              display: item.name || item.display
            })
          })
        } else {
          sendBack = {
            _id: val._id,
            link: this.table,
            display: val.name || val.display
          }
        }

        this.$emit("input", sendBack)
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
