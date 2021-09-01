<template>
  <div>
    <!-- Use the component in the right place of the template -->
    <tiptap-vuetify
      v-model="inputVal"
      @keydown="onKeyDown"
      :extensions="extensions"
      placeholder="Birşeyler Yazınız…"
      :card-props="{ rounded: true }"
    />
  </div>
</template>

<script>
// import the component and the necessary extensions
import {
  TiptapVuetify,
  Heading,
  Bold,
  Italic,
  Strike,
  Underline,
  Code,
  Paragraph,
  BulletList,
  OrderedList,
  ListItem,
  Link,
  Blockquote,
  HardBreak,
  HorizontalRule,
  History
} from "tiptap-vuetify"

export default {
  components: { TiptapVuetify },
  props: ["value"],
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
  data() {
    return {
      extensions: [
        History,
        Blockquote,
        Link,
        Underline,
        Strike,
        Italic,
        ListItem,
        BulletList,
        OrderedList,
        [
          Heading,
          {
            options: {
              levels: [1, 2, 3]
            }
          }
        ],
        Bold,
        Code,
        HorizontalRule,
        Paragraph,
        HardBreak
      ]
    }
  },
  methods: {
    onKeyDown() {
      this.$emit("textUpdate", this.value)
    }
  }
}
</script>
