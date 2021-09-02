<template>
  <v-container fluid style="min-height: 0;" grid-list-lg>
    <v-layout row wrap>
      <v-flex xs12>
        <v-alert border="left" icon="mdi-check" outlined type="info">
          Toplam 45 durum çözüldü.Tebrikler</v-alert
        >
      </v-flex>
      <v-flex xs12 sm4>
        <router-link :to="{ name: 'Duyurular' }">
          <v-card dark color="primary" class="white--text ma-0">
            <v-btn icon>
              <v-icon>mdi-bullhorn-outline</v-icon>
            </v-btn>

            <v-card-text class="text-center">
              <p class="headline">Duyurular</p>

              <p class="body-2">Aktif Duyuru : 3</p>
            </v-card-text>
          </v-card>
        </router-link>
      </v-flex>

      <v-flex xs12 sm4>
        <router-link :to="{ name: 'Teams' }">
          <v-card dark color="secondary" class="white--text ma-0">
            <v-btn icon>
              <v-icon>mdi-microsoft-teams</v-icon>
            </v-btn>

            <v-card-text class="text-center">
              <p class="headline">Takımlar</p>

              <p class="body-2">Takım Sayısı : 50</p>
            </v-card-text>
          </v-card>
        </router-link>
      </v-flex>
      <v-flex xs12 sm4>
        <router-link :to="{ name: 'Members' }">
          <v-card dark color="cyan" class="white--text ma-0">
            <v-btn icon>
              <v-icon>mdi-account</v-icon>
            </v-btn>

            <v-card-text class="text-center">
              <p class="headline">Üyeler</p>

              <p class="body-2">Aktif Üye : 123</p>
            </v-card-text>
          </v-card>
        </router-link>
      </v-flex>
      <v-flex xs12>
        <router-link :to="{ name: 'Cases' }">
          <v-layout row wrap>
            <v-flex xs12 sm4>
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
          </v-layout>
        </router-link>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
export default {
  data() {
    return {}
  }
}
</script>

<style lang="scss" scoped>
a {
  text-decoration: none;
}
</style>
