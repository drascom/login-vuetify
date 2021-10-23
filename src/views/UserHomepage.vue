<template>
  <div>
    <v-toolbar>
      <slot name="button"></slot>

      <v-toolbar-title>
        <slot name="title"></slot>
      </v-toolbar-title>

      <v-spacer></v-spacer>

      <v-btn icon class="hidden-xs-only">
        <v-icon>mdi-printer</v-icon>
      </v-btn>
    </v-toolbar>
    <requestList
    class="pt-2"
      v-if="homeSubPage == 1"
      :new="true"
      title="Benim İsteklerim"
      :items="myRequests"
    />
    <v-list dense v-if="homeSubPage == 2">
      <v-list-group
        :value="true"
        prepend-icon="mdi-account-circle"
        v-for="city in myCity"
        :key="city._id"
        no-action
      >
        <template v-slot:activator>
          <v-list-item-title> {{ city.name }}</v-list-item-title>
        </template>

        <v-list-group
          :value="true"
          no-action
          sub-group
          v-for="team in city.teams"
          :key="team._id"
        >
          <template v-slot:activator>
            <v-list-item-content>
              <v-list-item-title>{{ team.display }}</v-list-item-title>
            </v-list-item-content>
          </template>

          <v-list-item
            v-for="member in sortMembers(team.linked)"
            :key="member._id"
            link
          >
            <v-list-item-icon>
              <v-icon v-if="formatDate(member.time)" color="green">
                mdi-wifi
              </v-icon>
              <v-icon v-else color="grey"> mdi-wifi-off </v-icon>
            </v-list-item-icon>
            <v-list-item-title
              :class="formatDate(member.time) ? 'green--text' : ''"
            >
              {{ member.display }}
              <span v-if="!formatDate(member.time)">
                ({{ $moment(member.time * 1000).fromNow() }})
              </span></v-list-item-title
            >
          </v-list-item>
        </v-list-group>
      </v-list-group>
    </v-list>
    <messages v-if="homeSubPage == 3" :messages="myMessages"></messages>
  </div>
</template>

<script>
export default {
  name: "userhome",
  props: ["myRequests", "myMessages", "myCity", "userProfile", "homeSubPage"],
  components: {
    requestList: () => import("./Requests.vue"),
    messages: () => import("@/components/myMessages.vue")
  },
  methods: {
    formatDate(date) {
      let diff = this.$moment.unix(date).diff(this.$moment.fromNow, "minutes")
      diff = 0 - diff
      return diff < 2
    },
    sortMembers(members) {
      return members.slice().sort((a, b) => {
        return b.time - a.time
      })
    }
  },
  mounted() {}
}
</script>

<style lang="scss" scoped></style>
