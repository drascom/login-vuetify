<template>
  <v-container class="fill-height" fluid>
    <v-row align="center" justify="center">
      <v-col cols="12" sm="8" md="8">
        <v-card class="elevation-12">
          <v-window v-model="step">
            <v-window-item :value="1">
              <v-row>
                <v-col cols="12" md="8">
                  <v-card-text class="mt-12">
                    <h1 class="text-center display-1 teal--text text--accent-3">
                      DAD <br />sistemine hoşgeldiniz.
                    </h1>

                    <h4 class="text-center mt-4">
                      Üye olduğunuz email adresini girin.
                    </h4>
                    <v-form>
                      <v-text-field
                        label="Email"
                        name="Email"
                        prepend-icon="email"
                        type="text"
                        color="teal accent-3"
                        v-model="loginData.email"
                      />

                      <v-text-field
                        id="password"
                        label="Şifre"
                        name="password"
                        prepend-icon="lock"
                        color="teal accent-3"
                        v-model="loginData.password"
                        :type="!showPass ? 'text' : 'password'"
                        :append-icon="!showPass ? 'mdi-eye' : 'mdi-eye-off'"
                        @click:append="showPass = !showPass"
                      />
                    </v-form>
                    <h3 class="text-center mt-4">Şifremi unuttum ?</h3>
                  </v-card-text>
                  <div class="text-center my-3">
                    <v-btn
                      @click="handleSingIn()"
                      rounded
                      color="teal accent-3"
                      dark
                      >Giriş</v-btn
                    >
                  </div>
                </v-col>
                <v-col cols="12" md="4" class="teal accent-3">
                  <v-card-text class="white--text mt-4">
                    <h1 class="text-center display-1">Merhaba Arkadaşım !</h1>
                    <h5 class="text-center">
                      Bizimle bu yolda olmak için lütfen bilgilerini gir.
                    </h5>
                  </v-card-text>
                  <div class="text-center mb-4">
                    <v-btn rounded outlined dark @click="step++">ÜYE OL</v-btn>
                  </div>
                </v-col>
              </v-row>
            </v-window-item>
            <v-window-item :value="2">
              <v-row class="fill-height">
                <v-col cols="12" md="4" class="teal accent-3">
                  <v-card-text class="white--text mt-12">
                    <h1 class="text-center display-1">Hoşgeldin!</h1>
                    <h5 class="text-center">
                      Giriş yapmak için buraya tıkla.
                    </h5>
                  </v-card-text>
                  <div class="text-center">
                    <v-btn rounded outlined dark @click="step--"
                      >Giriş yap</v-btn
                    >
                  </div>
                </v-col>

                <v-col cols="12" md="8">
                  <v-card-text class="mt-12">
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
                        id="password"
                        label="Şifre"
                        name="password"
                        :rules="inputRules"
                        autocomplete="off"
                        prepend-icon="lock"
                        color="teal accent-3"
                        v-model="registerData.password"
                        :type="showPass ? 'text' : 'password'"
                        :append-icon="showPass ? 'mdi-eye' : 'mdi-eye-off'"
                        @click:append="showPass = !showPass"
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
                </v-col>
              </v-row>
            </v-window-item>
          </v-window>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import { mapActions } from "vuex"
// import { mapGetters } from "vuex"
export default {
  name: "Login",

  data: () => ({
    error: "",
    step: 1,
    isFormValid: false,
    showPass: true,
    loginData: {
      email: "a@b.com",
      password: "111111"
    },
    inputRules: [
      (v) => !!v || "Bu alan gerekli",
      (v) => (v && v.length >= 6) || "En Az 6 Karakter Giriniz"
    ],
    emailRules: [
      (v) => !!v || "Bu alan gerekli",
      (v) =>
        !v ||
        /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(v) ||
        "E-mail geçersiz"
    ],
    registerData: {
      name: "",
      password: "",
      email: "",
      role: "Üye"
    }
  }),
  computed: {
    isLoggedin() {
      return this.$store.state.user.isLoggedin
    }
    // ...mapGetters(["isLoggedin", "isLoginFailure"])
  },
  watch: {
    isLoggedin(newValue) {
      if (newValue) {
        this.$store.dispatch("snackbar/setSnackbar", {
          color: "success",
          message: "Giriş yapıldı"
        })
        this.$router.push("/dashboard")
      }
    },
    error(newValue) {
      if (newValue) {
        setTimeout(() => {
          this.error = false
        }, 2000)
      }
    }
  },
  methods: {
    ...mapActions(["login", "register"]),
    handleSingIn() {
      this.login({
        parent: "collections",
        child: "members",
        data: {
          fields: { password: 0 },
          filter: {
            type: "login",
            email: this.loginData.email,
            password: this.loginData.password.trim()
          }
        }
      })
    },
    async handleSingUp() {
      let result = await this.register(this.registerData)
      if (!result.status) {
        this.error = result.error || result
        this.$store.dispatch("snackbar/setSnackbar", {
          color: "error",
          message: "Formda hata var." + this.error
        })
      } else {
        this.$store.dispatch("snackbar/setSnackbar", {
          color: "warning",
          message: this.registerData.name + " kaydınız alındı."
        })
      }
    }
  },
  created() {
    if (this.isLoggedin) {
      this.$router.push({ name: "Dashboard" })
    }
  }
}
</script>
