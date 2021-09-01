<template>
  <div>
    <v-card v-for="post in posts" :key="post._id" class="ma-2 elevation-8">
      <v-card-title> {{ post.title }}</v-card-title>
      <v-card-text v-html="post.content"> </v-card-text>
      <v-card-actions>
        <v-list-item class="grow">
          <v-list-item-content>
            <v-list-item-title>Admin</v-list-item-title>
          </v-list-item-content>

          <v-row align="center" justify="end">
            <v-icon class="mr-1">
              mdi-calendar
            </v-icon>
            <span class="subheading mr-2">
              {{ post._created | moment("dddd, MMMM Do YYYY") }}</span
            >
            <span class="mr-1">·</span>
          </v-row>
        </v-list-item>
      </v-card-actions>
    </v-card>
  </div>
</template>

<script>
export default {
  props: ["posts"]
}
</script>

<style lang="scss" scoped></style>
