<template>
  <div>
    <v-autocomplete
      v-model="selectedValue"
      :items="list"
      item-value="display"
      item-text="name"
      outlined
      v-bind="attrs"
      v-on="listeners"
      return-object
      hide-selected
    >
      <template v-slot:selection="" v-if="hideselection"> </template>
    </v-autocomplete>
    <v-list dense v-if="hideselection && value">
      <v-subheader> Kayıtlı Üyeler {{ value.length }}</v-subheader>
      <v-list-item-group color="primary">
        <v-list-item v-for="(item, i) in value" :key="i" @click="remove(i)">
          <v-list-item-icon>
            <v-icon> mdi-account </v-icon>
          </v-list-item-icon>
          <v-list-item-content>
            <v-list-item-title v-text="item.display"></v-list-item-title>
          </v-list-item-content>
          <v-list-item-action>
            <v-btn icon>
              <v-icon color="red">mdi-trash-can-outline</v-icon></v-btn
            >
          </v-list-item-action>
        </v-list-item>
      </v-list-item-group>
    </v-list>
  </div>
</template>

<script>
/* eslint-disable no-unused-vars */
export default {
  name: "tags",
  props: ["value", "list", "table", "hideselection"],

  inheritAttrs: false,
  data() {
    return {
      inputVal: this.value
    }
  },
  computed: {
    listeners() {
      const { input, ...listeners } = this.$listeners
      return listeners
    },
    attrs() {
      return this.$attrs
    },
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
      if (index >= 0) this.value.splice(index, 1)
    }
  }
}
</script>

<style lang="scss" scoped></style>
