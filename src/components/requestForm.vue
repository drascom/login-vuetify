<template>
  <v-card flat>
    <v-toolbar color="grey lighten-3" dark extended flat>
      <v-spacer></v-spacer>
      <v-icon v-if="member" color="red" class="mt-n5" @click="closeForm()">
        mdi-close
      </v-icon>
      <v-btn v-else icon to="/"><v-icon>mdi-close</v-icon></v-btn>
    </v-toolbar>

    <v-card class="mx-auto" max-width="700" style="margin-top: -64px;">
      <v-toolbar flat>
        <v-icon color="red" left class="" @click="closeForm()">
          mdi-arrow-left
        </v-icon>
        <v-spacer></v-spacer>
        <v-toolbar-title class=" grey--text">
          İstek Oluştur
        </v-toolbar-title>
        <v-spacer></v-spacer>

        <v-btn
          :dark="isFormValid"
          v-if="member"
          color="blue accent-3"
          @click="saveForm"
          :disabled="!isFormValid"
        >
          Kaydet
        </v-btn>
      </v-toolbar>

      <v-divider></v-divider>

      <v-card flat tile ref="capture" id="capture">
        <v-card-text v-show="!kontrolEt" v-if="!member">
          <h5>
            Bu form hiçbir yere kaydedilmez,
            <br />
            KONTROL ET butonuna bastığınızda formunuzu resim formatında
            görüntüler
            <br />
            KAYDET butonuna bastığınızda resim dosyasını indirip ilgili whatsapp
            grubuna göndermenizi sağlar.
          </h5>
        </v-card-text>
        <v-card-text class="">
          <v-form v-model="isFormValid" lazy-validation>
            <h4>İstek Amacınız Nedir ?</h4>
            <v-radio-group v-model="form.urgency" mandatory>
              <v-radio label="Acil Durumum var." :value="acil"></v-radio>
              <v-radio label="Destek ihtiyacım var." :value="destek"></v-radio>
              <v-radio label="Bilgi almak istiyorum" :value="bilgi"></v-radio>
            </v-radio-group>
            <tags
              :disabled="firstCityDisabled"
              :multi="false"
              v-model="form.first_city"
              hint=" Şehirinizi  Seçiniz"
              prepend-icon="apartment"
              :persistent-hint="!form.first_city"
              chips
              small-chips
              label="Sizin Şehriniz"
              key="firstcity"
              :list="cities"
              table="cities"
              :menu-props="{ closeOnContentClick: true }"
            ></tags>
            <tags
              dense
              :multi="false"
              v-model="form.second_city"
              hint="İstek Yapılacak Şehir Seçiniz"
              prepend-icon="apartment"
              :persistent-hint="!form.second_city"
              chips
              small-chips
              label="İstek Yapılan Şehir"
              key="secondcity"
              :list="cities"
              table="cities"
              :menu-props="{ closeOnContentClick: true }"
              class="mb-4"
            ></tags>

            <v-text-field
              label="Hastane Adı"
              name="hastane"
              autocomplete="new-password"
              prepend-icon="local_hospital"
              type="text"
              color="teal accent-3"
              v-model="form.hospital"
            />
            <v-text-field
              label="Hasta Adı"
              name="hasta_adi"
              :rules="inputRules"
              autocomplete="new-password"
              prepend-icon="person"
              type="text"
              color="teal accent-3"
              v-model="form.patient_name"
            />
            <v-text-field
              label="Yakınlık Derecesi"
              name="kinship"
              :rules="inputRules"
              autocomplete="new-password"
              prepend-icon="person"
              type="text"
              color="teal accent-3"
              v-model="form.kinship"
            />
            <v-textarea
              auto-grow
              rows="1"
              label="Acil Durum"
              hint="Lütfen sorunu detaylı olarak yazınız."
              persistent-hint
              name="kinship"
              :rules="inputRules"
              autocomplete="new-password"
              prepend-icon="person"
              type="text"
              color="teal accent-3"
              v-model="form.problem"
            />
            <v-text-field
              v-if="!member"
              label="Başvuran Adı Soyadı"
              name="name"
              prepend-icon="person"
              placeholder=""
              :rules="inputRules"
              autocomplete="new-password"
              type="text"
              color="teal accent-3"
              v-model="form.applicant_name"
            />
            <v-text-field
              v-if="!member"
              label="E-mail"
              name="Email"
              autocomplete="new-password"
              prepend-icon="email"
              type="text"
              color="teal accent-3"
              v-model="form.email"
            />
            <v-text-field
              v-if="!member"
              label="Telefon Numaranız"
              name="phone"
              :rules="inputRules"
              autocomplete="new-password"
              prepend-icon="phone"
              type="text"
              color="teal accent-3"
              v-model="form.phone"
            />
          </v-form>
        </v-card-text>
        <v-card-actions class="d-flex justify-space-between">
          <v-btn
            v-if="!member"
            :dark="isFormValid"
            color="orange accent-3"
            @click="kontrolEt = !kontrolEt"
            :disabled="!isFormValid"
          >
            {{ kontrolEt ? "Değiştir" : "Kontrol Et" }}
          </v-btn>
          <span v-if="!isFormValid"> Formunuzda Eksikler var</span>
          <v-btn
            v-if="!member"
            dark
            color="blue accent-3"
            @click="onCapture"
            :disabled="capturing || !kontrolEt"
          >
            {{ capturing ? "Kaydediliyor..." : "Kaydet" }}
          </v-btn>
          <v-spacer></v-spacer>
          <v-btn
            :dark="isFormValid"
            v-if="member"
            color="blue accent-3"
            @click="saveForm"
            :disabled="!isFormValid"
          >
            Kaydet
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-card>
  </v-card>
</template>

<script>
/* eslint-disable quotes */

import * as htmlToImage from "html-to-image"
import { mapActions } from "vuex"
import tags from "@/components/ui/autocomplete.vue"
import { mapGetters } from "vuex"
let initForm = {
  first_city: null,
  second_city: null,
  hospital: "deneme hastanesi",
  patient_name: "deneme hastası",
  kinship: "deneme akrabalık",
  problem: "deneme hastanın sorunu ihtiyacı ulaşılacak kişi vs...",
  applicant_name: "",
  phone: "123123213",
  email: "aaa@bbbb.com",
  published: true,
  status: "waiting",
  urgency: { title: "Acil", color: "red" }
}
export default {
  name: "requestForm",
  components: {
    tags
  },
  methods: {
    ...mapActions(["getAllItems", "save", "delete"]),
    closeForm() {
      this.form = {
        ...initForm
      }
      !this.user ? this.$router.push("/") : this.$emit("close-form", true)
      this.$emit("close-form", true)
    },
    async saveForm() {
      let result = await this.save({
        parent: "collections",
        child: "requests",
        data: this.form
      })
      if (result.statusText) {
        this.$store.commit("snackbar/success", "İstek Kaydedildi.")
        this.closeForm()
      } else {
        this.$store.commit("snackbar/error", "Mesaj Gönderilemedi.")
      }
    },
    onCapture() {
      this.saveForm()
      this.capturing = true
      htmlToImage
        .toBlob(document.getElementById("capture"))
        .then(function(blob) {
          const a = document.createElement("a")
          a.href = URL.createObjectURL(blob)
          a.download = "istek_formu.png"
          a.click()
          navigator.clipboard.write([
            // eslint-disable-next-line no-undef
            new ClipboardItem({
              [blob.type]: blob
            })
          ])
        })
      this.capturing = false
    }
  },
  props: ["isMember"],
  computed: {
    ...mapGetters(["user", "collections"]),
    member() {
      return this.isMember
    },
    cities() {
      return this.collections("cities")
    },
    firstCityDisabled() {
      return this.user.role == "uye"
    },
    form: {
      get() {
        if (this.user) {
          let newForm = {
            ...initForm,
            member_name: {
              _id: this.user._id,
              link: "members",
              display: this.user.name
            }
          }
          if (this.user.role == "uye") {
            newForm.first_city = this.user.city
          }
          return newForm
        }
        return {
          ...initForm
        }
      },
      set(value) {
        return value
      }
    }
  },
  data: () => ({
    error: "",
    acil: '{ "title": "Acil", "color": "red" }',
    bilgi: '{ "title": "Bilgi", "color": "orange" }',
    destek: '{ "title": "Destek", "color": "blue" }',
    intro: true,
    capturing: false,
    isFormValid: false,
    kontrolEt: false,
    showPass: true,
    inputRules: [(v) => !!v || "Bu alan gerekli"],
    emailRules: [
      (v) => !!v || "Bu alan gerekli",
      (v) =>
        !v ||
        /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(v) ||
        "E-mail geçersiz"
    ]
  }),
  mounted() {}
}
</script>

<style lang="scss" scoped></style>
