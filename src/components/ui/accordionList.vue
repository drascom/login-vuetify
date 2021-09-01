<template>
  <v-expansion-panels v-model="active" multiple>
    <v-expansion-panel
      v-for="(post, index) in posts"
      :key="post._id"
      :readonly="active[0] == index"
    >
      <v-expansion-panel-header>
        <v-row no-gutters style="width: 100%">
          <v-col cols="6">
            {{ post.title }}
          </v-col>
          <v-col cols="6">
            {{ post._created | moment("dddd, MMMM Do YYYY") }}
          </v-col>
        </v-row>
      </v-expansion-panel-header>
      <v-expansion-panel-content>
        {{ post.content }}
      </v-expansion-panel-content>
    </v-expansion-panel>
  </v-expansion-panels>
</template>

<script>
export default {
  name: "AccordionList",
  data() {
    return {
      active: [0]
    }
  },
  props: ["posts"]
}
</script>

<style lang="scss" scoped></style>
