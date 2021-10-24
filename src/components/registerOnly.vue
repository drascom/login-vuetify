<template>
  <v-container>
    <v-card class="pa-8">
      <v-card-text class="ma-12 pt-12">
        <h1 class="text-center display-2 teal--text text--accent-3">
          Hesap oluştur.
        </h1>

        <v-alert
          v-if="error"
          border="left"
          colored-border
          type="error"
          class="elevation-6 my-4"
        >
          {{ error }}
        </v-alert>
        <v-form v-model="isFormValid">
          <v-text-field
            label="Ad Soyad"
            name="name"
            prepend-icon="person"
            placeholder=""
            :rules="inputRules"
            autocomplete="new-password"
            type="text"
            color="teal accent-3"
            v-model="registerData.name"
          />
          <v-text-field
            label="E-mail"
            name="Email"
            :rules="emailRules"
            autocomplete="new-password"
            prepend-icon="email"
            type="text"
            color="teal accent-3"
            v-model="registerData.email"
          />
          <v-text-field
            label="Telefon Numaranız"
            name="phone"
            :rules="inputRules"
            autocomplete="new-password"
            prepend-icon="phone"
            type="text"
            color="teal accent-3"
            v-model="registerData.phone"
          />

          <v-text-field
            id="password"
            label="Bir Şifre Oluşturun"
            name="password"
            :rules="inputRules"
            autocomplete="off"
            prepend-icon="lock"
            color="teal accent-3"
            v-model="registerData.password"
            :type="showPass ? 'text' : 'password'"
            :append-icon="showPass ? 'mdi-eye' : 'mdi-eye-off'"
            @click:append="showPass = !showPass"
            v-on:keyup="pressRegister"
          />
        </v-form>
      </v-card-text>
      <div class="text-center mt-n5 mb-3">
        <v-btn
          :disabled="!isFormValid"
          @click="handleSingUp()"
          rounded
          color="teal accent-3"
          :dark="isFormValid"
        >
          Üye Ol</v-btn
        >
      </div>
    </v-card>
  </v-container>
</template>

<script>
import { mapActions } from "vuex"

export default {
  name: "register",
  props: ["formData", "applicant_name"],
  data() {
    return {
      isFormValid: false,
      error: false,
      showPass: true,
      registerData: {
        name: "",
        password: "",
        email: "",
        role: "uye",
        phone: "",
        published: true
      }
    }
  },
  watch: {
    error(newValue) {
      if (newValue) {
        setTimeout(() => {
          this.error = false
        }, 2000)
      }
    }
  },
  methods: {
    ...mapActions(["register"]),
    pressRegister(e) {
      if (e.keyCode === 13) {
        this.handleSingUp()
      }
    },
    async handleSingUp() {
      let result = await this.register({
        type: "register",
        ...this.registerData
      })
      result ? (this.step = 1) : ""
      this.registerData = {
        name: "",
        password: "",
        email: "",
        role: "uye",
        published: true
      }
    }
  },
  mounted() {
    this.registerData = {
      name: this.applicant_name,
      email: this.formData.email,
      phone: this.formData.phone,
      role: "uye",
      published: true
    }
  }
}
</script>

<style lang="scss" scoped></style>
