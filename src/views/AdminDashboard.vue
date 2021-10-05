<template>
  <v-container fluid style="min-height: 0;" grid-list-lg>
    <v-layout row wrap>
      <v-flex xs12>
        <v-alert border="left" icon="mdi-check" outlined type="info">
          Toplam 45 durum çözüldü.Tebrikler</v-alert
        >
      </v-flex>
      <v-flex xs12 sm3>
        <router-link :to="{ name: 'Duyurular' }">
          <v-card dark color="grey darken-2" class="white--text ma-0">
            <v-btn icon>
              <v-icon>mdi-bullhorn-outline</v-icon>
            </v-btn>

            <v-card-text class="text-center">
              <p class="headline">Duyurular</p>

              <p class="body-2">Aktif Duyuru : {{ countDuyurular }}</p>
            </v-card-text>
          </v-card>
        </router-link>
      </v-flex>

      <v-flex xs12 sm3>
        <router-link :to="{ name: 'Cities' }">
          <v-card dark color="grey darken-1" class="white--text ma-0">
            <v-btn icon>
              <v-icon>mdi-microsoft-teams</v-icon>
            </v-btn>

            <v-card-text class="text-center">
              <p class="headline">Takımlar</p>

              <p class="body-2">Takım Sayısı : {{ countTeams }}</p>
            </v-card-text>
          </v-card>
        </router-link>
      </v-flex>
      <v-flex xs12 sm3>
        <router-link
          :to="{ name: 'NewMemberList', params: { type: 'moderator' } }"
        >
          <v-card dark color="grey" class="ma-0">
            <v-btn icon>
              <v-icon>mdi-account</v-icon>
            </v-btn>

            <v-card-text class="text-center">
              <p class="headline">Adminler</p>

              <p class="body-2">Aktif Üye : {{ countModerators }}</p>
            </v-card-text>
          </v-card>
        </router-link>
      </v-flex>

      <v-flex xs12 sm3>
        <router-link :to="{ name: 'NewMemberList', params: { type: 'uye' } }">
          <v-card color="grey lighten-1" class=" ma-0">
            <v-btn icon>
              <v-icon>mdi-account</v-icon>
            </v-btn>

            <v-card-text class="text-center">
              <p class="headline">Üyeler</p>

              <p class="body-2">Aktif Üye : {{ countMembers }}</p>
            </v-card-text>
          </v-card>
        </router-link>
      </v-flex>
      <v-flex xs12>
        <router-link :to="{ name: 'Requests' }">
          <v-layout row wrap>
            <v-flex xs12 sm3>
              <v-alert border="left" icon="mdi-plus" outlined type="info">
                Toplam 45 durum bildirildi
              </v-alert>
            </v-flex>
            <v-flex xs12 sm4>
              <v-alert border="left" icon="mdi-check" outlined type="success">
                Toplam 25 durum çözüldü.Tebrikler
              </v-alert>
            </v-flex>
            <v-flex xs12 sm4>
              <v-alert border="left" icon="mdi-cancel" outlined type="error">
                Toplam 20 durum bekliyor.
              </v-alert>
            </v-flex>
            <v-flex xs12>
              <router-link :to="{ name: 'UserDashboard' }">
                <v-card dark color="grey" class="ma-0">
                  <v-btn icon>
                    <v-icon>mdi-account</v-icon>
                  </v-btn>

                  <v-card-text class="text-left">
                    <p class="headline">Kullanıcı Sayfası</p>
                    <pre> {{ user }} </pre>
                  </v-card-text>
                </v-card>
              </router-link>
            </v-flex>
          </v-layout>
        </router-link>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
import { mapGetters } from "vuex"
import init from "@/components/helper/init.vue"

export default {
  data() {
    return {}
  },
  mixins: [init],
  computed: {
    ...mapGetters([
      "countDuyurular",
      "countMembers",
      "countModerators",
      "countTeams",
      "user"
    ])
  },
  async mounted() {
    init
  }
}
</script>

<style lang="scss" scoped>
a {
  text-decoration: none;
}
</style>
