<script>
import { mapState } from "vuex"
import { mapActions } from "vuex"
export default {
  name: "init",
  props: ["check"],
  computed: {
    ...mapState({
      members: (state) => state.collections.members,
      teams: (state) => state.collections.teams,
      cities: (state) => state.collections.cities,
      teammember: (state) => state.collections.teammember,
      user: (state) => state.memberData
    })
  },
  methods: {
    ...mapActions(["getAllItems", "save", "delete"])
  },
  async mounted() {
    if (!this.cities || this.cities.length <= 0) {
      await this.getAllItems({
        parent: "collections",
        child: "cities",
        data: {
          sort: { name: 1 }
        }
      })
    }
    if (!this.teams || this.teams.length <= 0) {
      await this.getAllItems({
        parent: "collections",
        child: "teams",
        data: {
          sort: { name: 1 }
        }
      })
    }
    if (!this.members || this.members.length <= 0) {
      await this.getAllItems({
        parent: "collections",
        child: "members",
        data: ""
      })
    }
    if (!this.teammember || this.teammember.length <= 0) {
      await this.getAllItems({
        parent: "collections",
        child: "teammember",
        data: ""
      })
    }
    if (!this.cases || this.cases.length <= 0) {
      await this.getAllItems({
        parent: "collections",
        child: "cases",
        data: ""
      })
    }
    if (!this.requests || this.requests.length <= 0) {
      await this.getAllItems({
        parent: "collections",
        child: "requests",
        data: ""
      })
    }
    if (!this.messages || this.messages.length <= 0) {
      await this.getAllItems({
        parent: "collections",
        child: "messages",
        data: {
          filter: {
            $or: [{ receiver: this.user._id }, { sender: this.user._id }]
          }
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped></style>
