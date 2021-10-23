<template>
  <v-container class="fill-height" fluid>
    <v-slide-y-transition hide-on-leave>
      <home @step="setStep" v-if="intro"></home>
    </v-slide-y-transition>
    <v-row v-if="!intro" align="center" justify="center">
      <v-col cols="12" sm="8" md="8">
        <v-card class="elevation-12">
          <v-window v-model="step">
            <v-window-item :value="1">
              <v-row>
                <v-col cols="12" md="8">
                  <v-card-text class="mt-12">
                    <h2 class="text-center teal--text text--accent-3">
                      DAD <br />sistemine hoşgeldiniz.
                    </h2>

                    <h4 class="text-center mt-4">
                      Alttaki butonlara basarak farklı yetkilerle
                      girebilirsiniz.
                    </h4>
                    <v-divider></v-divider>
                    <v-container class="my-6">
                      <v-row justify="space-around">
                        <v-btn @click="moderatorLogin()"> Yönetici Giriş</v-btn>
                        <v-btn @click="memberLogin()"> Üye Giriş</v-btn>
                      </v-row></v-container
                    >
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
                        id="loginpassword"
                        label="Şifre"
                        name="password"
                        prepend-icon="lock"
                        color="teal accent-3"
                        v-model="loginData.password"
                        :type="!showPass ? 'text' : 'password'"
                        :append-icon="!showPass ? 'mdi-eye' : 'mdi-eye-off'"
                        @click:append="showPass = !showPass"
                        v-on:keyup="pressLogin"
                      />
                    </v-form>
                    <h3 class="text-center mt-4" @click="step = 3">
                      Şifremi unuttum ?
                    </h3>
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
                    <v-btn rounded outlined dark @click="step--">
                      Giriş yap
                    </v-btn>
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
                </v-col>
              </v-row>
            </v-window-item>
            <v-window-item :value="3">
              <v-row class="fill-height">
                <v-col cols="12" md="8">
                  <v-card-text class=" mt-12">
                    <h1 class="text-center display-1 teal--text text--accent-3">
                      Sıfırlama İsteği !
                    </h1>
                    <h4 class="text-center">
                      Kayıt olduğun email adresini kutucuğa yazar mısın ?
                    </h4>
                  </v-card-text>
                  <v-card-text class="">
                    <v-alert
                      v-if="error"
                      border="left"
                      colored-border
                      type="error"
                      class="elevation-6 my-4"
                    >
                      {{ error }}
                    </v-alert>
                    <v-form v-model="isForgetFormValid">
                      <v-text-field
                        outlined
                        label="E-mail"
                        name="Email"
                        :rules="emailRules"
                        autocomplete="new-password"
                        prepend-inner-icon="email"
                        type="text"
                        color="teal accent-3"
                        v-model="registerData.email"
                      />
                    </v-form>
                    <div class="text-center  mb-3">
                      <v-btn
                        :disabled="!isForgetFormValid"
                        @click="handleForgot()"
                        rounded
                        color="teal accent-3"
                        :dark="isForgetFormValid"
                      >
                        Şifre Gönder
                      </v-btn>
                    </div>
                  </v-card-text>
                </v-col>

                <v-col cols="12" class="teal accent-3" md="4">
                  <v-card-text class="white--text mt-4">
                    <h1 class="text-center ma-8">Şimdi Hatırladım !</h1>
                    <h4 class="text-center font-weight-medium">
                      Şifreni hatırladıysan girişe gidebilirsin.
                    </h4>
                  </v-card-text>
                  <div class="text-center  mb-3">
                    <v-btn dark @click="step = 1" rounded color="teal accent-3">
                      Girişe Dön
                    </v-btn>
                  </div>
                </v-col>
              </v-row>
            </v-window-item>
            <v-window-item :value="4" v-if="token">
              <v-row class="fill-height">
                <v-col cols="12" md="8">
                  <v-card-text class=" mt-12">
                    <h2 class="text-center display-1 teal--text text--accent-3">
                      Hadi Sıfırlayalım
                    </h2>
                    <h5 class="text-center">
                      En az 6 haneli yeni şifreni yazar mısın ?
                    </h5>
                  </v-card-text>
                  <v-card-text class="">
                    <v-alert
                      v-if="error"
                      border="left"
                      colored-border
                      type="error"
                      class="elevation-6 my-4"
                    >
                      {{ error }}
                    </v-alert>
                    <v-form v-model="isNewPasswordValid">
                      <v-text-field
                        id="password"
                        label="Şifre"
                        name="password"
                        :rules="inputRules"
                        autocomplete="off"
                        prepend-icon="lock"
                        color="teal accent-3"
                        v-model="newPassword"
                        :type="showPass ? 'text' : 'password'"
                        :append-icon="showPass ? 'mdi-eye' : 'mdi-eye-off'"
                        @click:append="showPass = !showPass"
                        v-on:keyup="pressNewPassword"
                      />
                    </v-form>
                    <div class="text-center  mb-3">
                      <v-btn
                        :disabled="!isNewPasswordValid"
                        @click="handleUpdate()"
                        rounded
                        color="teal accent-3"
                        :dark="isNewPasswordValid"
                      >
                        Güncelle
                      </v-btn>
                    </div>
                  </v-card-text>
                </v-col>
                <v-col cols="12" class="teal accent-3" md="4">
                  <v-card-text class="white--text mt-4">
                    <h1 class="text-center display-1">Vazgeçtim !</h1>
                    <h4 class="text-center">
                      Şifreni hatırladıysan girişe gidebilirsin.
                    </h4>
                  </v-card-text>
                  <div class="text-center  mb-3">
                    <v-btn dark @click="step = 1" rounded color="teal accent-3">
                      Girişe Dön
                    </v-btn>
                  </div>
                </v-col>
              </v-row>
            </v-window-item>
            <v-window-item :value="5">
              <v-row class="fill-height">
                <v-col cols="12" md="8">
                  <v-card-text class=" mt-12">
                    <h2 class="text-center display-1 teal--text text--accent-3">
                      Talebiniz Alındı
                    </h2>
                    <h5 class="text-center">
                      Lütfen emalinizi kontrol ederek maildeki butona tıklayın.
                      <p>Böylece yeni şifrenizi ayarlayabilirsiz</p>
                    </h5>
                  </v-card-text>
                </v-col>
                <v-col cols="12" class="teal accent-3" md="4">
                  <v-card-text class="white--text mt-4">
                    <h1 class="text-center ma-8">Duyuruları oku !</h1>
                    <h4 class="text-center font-weight-medium mb-4">
                      Mailini beklerken anasayfada duyuruları okuyabilirsin.
                    </h4>
                  </v-card-text>
                  <div class="text-center  mb-3">
                    <v-btn dark @click="$router.push('/')" rounded color="">
                      Girişe Dön
                    </v-btn>
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
import helpers from "@/plugins/helper.js"
import home from "@/views/Home"
export default {
  name: "Login",
  props: {
    window: {
      type: Number,
      default: 1
    }
  },
  components: {
    home
  },
  data() {
    return {
      error: "",
      intro: true,
      isFormValid: false,
      isForgetFormValid: false,
      isNewPasswordValid: false,
      token: "",
      step: this.window,
      memberId: "",
      newPassword: "222222",
      showPass: true,
      loginData: {
        email: "",
        password: ""
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
        role: "uye",
        published: true
      }
    }
  },
  computed: {
    isLoggedin() {
      return this.$store.state.isLoggedin
    },
    user() {
      return this.$store.state.memberData
    }
  },
  watch: {
    isLoggedin(newValue) {
      if (newValue) {
        this.user.role == "admin"
          ? this.$router.push({ name: "AdminDashboard" })
          : this.$router.push({ name: "UserDashboard" })
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
    moderatorLogin() {
      this.loginData.email = "moderator@dad.com"
      this.loginData.password = "111111"
      this.handleSingIn()
    },
    memberLogin() {
      this.loginData.email = "uye@dad.com"
      this.loginData.password = "111111"
      this.handleSingIn()
    },
    ...helpers,
    ...mapActions(["login", "register", "forgot", "check"]),
    setStep(e) {
      this.intro = false
      this.step = e
    },
    pressLogin(e) {
      if (e.keyCode === 13) {
        this.handleSingIn()
      }
    },
    pressRegister(e) {
      if (e.keyCode === 13) {
        this.handleSingUp()
      }
    },
    pressNewPassword(e) {
      if (e.keyCode === 13) {
        this.handleUpdate()
      }
    },
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
    async handleForgot() {
      this.registerData.token = this.generateCode(6)
      let result = await this.forgot({
        data: {
          fields: { email: 1, name: 1 },
          filter: {
            type: "forgot",
            email: this.registerData.email,
            token: this.registerData.token
          }
        }
      })
      if (result) {
        this.step = 1
        this.registerData.email = ""
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
    },
    async handleUpdate() {
      let token = await this.check({
        filter: {
          token: this.token,
          _id: this.memberId
        }
      })
      if (token) {
        let pass = await this.register({
          password: this.newPassword,
          _id: this.memberId,
          token: ""
        })
        pass ? (this.step = 1) : console.log("şifre kaydedilemedi")
      } else {
        console.log("token bulunamadı")
      }
    }
  },
  created() {
    if (this.isLoggedin) {
      this.user.role == "admin"
        ? this.$router.push({ name: "AdminDashboard" })
        : this.$router.push({ name: "UserDashboard" })
    }
  },
  mounted() {
    if (this.$route.query.token && this.$route.query.token.length > 8) {
      var arr = this.$route.query.token.split("-")
      this.token = arr[0]
      this.memberId = arr[1]
      this.step = 4
    }
  }
}
</script>
