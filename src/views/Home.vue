<template>
  <v-container>
    <v-layout text-center wrap>
      <v-flex xs12>
        <div
          class="v-image__image v-image__image--cover"
          style='background-image: url("/logo.png"); background-position: center center;'
        ></div>
        <v-img src="/dad/logo.png" class="my-3" contain height="200"></v-img>
      </v-flex>

      <v-flex mb-4>
        <h1 class="display-2 font-weight-bold mb-3">
          Hoşgeldiniz
        </h1>
        <p class="subheading font-weight-regular">
          Sayın meslektaşım 1. derece yakınınızın acil bir sağlık durumu
          olduğunda en kısa sürede bulunduğu şehirdeki meslektaşlarına
          ulaşabilir yardım alabilirsin.Diğer Meslektaşlarına hemen ulaşmak için
          ÜYE OL butonuna tıklayıp formu doldurman yeterli.
        </p>
      </v-flex>
    </v-layout>
    <v-row justify="space-around">
      <v-col cols="12" sm="4">
        <v-btn large dark color="cyan" block @click="step(2)"> Üye ol </v-btn>
      </v-col>
      <v-col cols="12" sm="4">
        <v-btn large color="primary" block @click="step(1)"> Giriş yap </v-btn>
      </v-col>
      <v-col cols="12" sm="4">
        <v-btn large color="secondary" block @click="step(3)">
          Şifremi Unuttum
        </v-btn>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
export default {
  methods: {
    step(val) {
      this.$emit("step", val)
    }
  }
}
</script>
