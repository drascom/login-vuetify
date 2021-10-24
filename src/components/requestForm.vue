<template>
  <v-card flat>
    <v-dialog fullscreen v-model="register">
      <register
        :formData="formData"
        :applicant_name="applicant_name"
      ></register>
    </v-dialog>
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
      <v-card v-if="outro && !member">
        <v-card-text>
          <h5>
            Formunuz oluşturuldu. <br />
            Resim olarak indirdiğiniz dosyayı whatsapp gruplarına
            gönderebilirsiniz.
          </h5>
        </v-card-text>
        <v-card-actions class="d-flex justify-center">
          <v-btn to="/" color="primary"> Anasayfa</v-btn>
        </v-card-actions>
      </v-card>
      <v-card v-else flat tile ref="capture" id="capture">
        <v-card-text v-show="!kontrolEt" v-if="!member">
          <h5>
            Bu form hiçbir yere kaydedilmez,
            <br />
            KAYDET butonuna bastığınızda resim dosyasını indirip ilgili whatsapp
            grubuna göndermenizi sağlar.
          </h5>
        </v-card-text>
        <v-card-text class="">
          <v-form v-model="isFormValid">
            <h4>İstek Amacınız Nedir ?</h4>
            <v-radio-group v-model="formData.urgency" mandatory>
              <v-radio label="Acil Durumum var." :value="acil"></v-radio>
              <v-radio label="Destek ihtiyacım var." :value="destek"></v-radio>
              <v-radio label="Bilgi almak istiyorum" :value="bilgi"></v-radio>
            </v-radio-group>
            <tags
              :disabled="firstCityDisabled"
              :multi="false"
              v-model="formData.first_city"
              hint=" Şehirinizi  Seçiniz"
              prepend-icon="apartment"
              :persistent-hint="!formData.first_city"
              chips
              small-chips
              label="Sizin Şehriniz"
              key="firstcity"
              :list="cities"
              table="cities"
              :menu-props="{ closeOnContentClick: true }"
            ></tags>
            <tags
              :multi="false"
              v-model="formData.second_city"
              hint="İstek Yapılacak Şehir Seçiniz"
              prepend-icon="apartment"
              :persistent-hint="!formData.second_city"
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
              v-model="formData.hospital"
            />
            <v-text-field
              label="Hasta Adı"
              name="hasta_adi"
              :rules="inputRules"
              autocomplete="new-password"
              prepend-icon="person"
              type="text"
              color="teal accent-3"
              v-model="formData.patient_name"
            />
            <v-text-field
              label="Yakınlık Derecesi"
              name="kinship"
              :rules="inputRules"
              autocomplete="new-password"
              prepend-icon="person"
              type="text"
              color="teal accent-3"
              v-model="formData.kinship"
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
              v-model="formData.problem"
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
              v-model="applicant_name"
            />
            <v-text-field
              v-if="!member"
              label="E-mail"
              name="Email"
              autocomplete="new-password"
              prepend-icon="email"
              type="text"
              color="teal accent-3"
              v-model="formData.email"
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
              v-model="formData.phone"
            />
          </v-form>
        </v-card-text>
        <v-card-actions class="d-flex justify-space-between">
          <span
            class="mx-4"
            v-if="
              !isFormValid ||
                formData.first_city == null ||
                formData.second_city == null
            "
          >
            Formunuzda Eksikler var</span
          >
          <v-spacer></v-spacer>
          <v-btn
            v-if="!member"
            :dark="
              isFormValid ||
                formData.first_city != null ||
                formData.second_city != null
            "
            color="blue accent-3"
            @click="saveForm"
            :disabled="
              !isFormValid ||
                formData.first_city == null ||
                formData.second_city == null
            "
          >
            <v-icon left>mdi-cloud-download</v-icon>
            {{ capturing ? "Kaydediliyor..." : "INDIR" }}
          </v-btn>

          <v-btn
            :dark="
              isFormValid ||
                formData.first_city != null ||
                formData.second_city != null
            "
            v-else
            color="blue accent-3"
            @click="saveForm"
            :disabled="
              !isFormValid ||
                formData.first_city == null ||
                formData.second_city == null
            "
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
  member_name: {},
  first_city: null,
  second_city: null,
  hospital: "deneme hastanesi",
  patient_name: "deneme hastası",
  kinship: "deneme akrabalık",
  problem:
    "deneme hastanın sorunu ihtiyacı ulaşılacak kişi vs yazılacak.Yazı oldukça uzun olrsa nasıl ayarlanacağını görmek için gereksi metinler ekliyorum.",
  phone: "123123213",
  email: "aaa@bbbb.com",
  published: true,
  status: "waiting",
  urgency: { title: "Acil", color: "red" }
}
export default {
  name: "requestForm",
  components: {
    tags,
    register: () => import("@/components/registerOnly.vue")
  },

  props: ["isMember"],
  computed: {
    ...mapGetters(["user", "collections"]),
    member() {
      return this.isMember || false
    },
    cities() {
      return this.collections("cities")
    },
    firstCityDisabled() {
      return this.user.role == "uye"
    }
  },
  methods: {
    ...mapActions(["getAllItems", "save", "delete"]),
    closeForm() {
      !this.user ? this.$router.push("/") : this.$emit("close-form", true)
      this.$emit("close-form", true)
    },
    async saveApplicant() {
      return await this.save({
        parent: "collections",
        child: "members",
        data: {
          name: this.applicant_name,
          email: this.formData.email,
          phone: this.formData.phone,
          role: "misafir",
          city: this.formData.first_city
        }
      })
    },
    async saveForm() {
      let error = false
      //üye olmadan form dolduranlar için
      if (this.applicant_name) {
        let result = await this.saveApplicant()
        error = !result.statusText ? result : false
        if (error == "Email adresi zaten kayıtlı") {
          const res = await this.$confirm(
            "Email adresiniz kayıtlı.<br />" +
              "Dilerseniz üyeliğinizi tamamlayabilirsiniz.",
            {
              title: "Kayıtlı Üye",
              buttonTrueText: "Üyeliği tamamla",
              buttonFalseText: "Sadece Indir",
              color: "orange"
            }
          )
          if (res) {
            this.register = true
          }
        } else {
          this.formData.member_name = {
            _id: result.data._id,
            link: "members",
            display: result.data.name
          }
        }
      }

      let result = await this.save({
        parent: "collections",
        child: "requests",
        data: this.formData
      })
      if (result.statusText) {
        if (this.user) {
          this.$store.commit("snackbar/success", "İstek Kaydedildi.")
          const res = await this.$confirm(
            "İsteğiniz oluşturuldu.<br />" +
              "Bu isteği resim olarak indirmek istermisiniz..",
            {
              title: "Kaydedildi",
              buttonTrueText: "Indir",
              buttonFalseText: "Kapat",
              color: "green"
            }
          )
          if (res) {
            await this.onCapture()
          } else {
            this.closeForm()
          }
        }
        this.outro = true
      } else {
        this.$store.commit("snackbar/error", `İstek kaydedilemedi.${result}`)
      }
    },
    onCapture() {
      console.log("capture başladı")
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
      this.outro = true
    }
  },
  data: () => ({
    error: "",
    acil: '{ "title": "Acil", "color": "red" }',
    bilgi: '{ "title": "Bilgi", "color": "orange" }',
    destek: '{ "title": "Destek", "color": "blue" }',
    applicant_name: "",
    formData: {},
    intro: true,
    outro: false,
    register: false,
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
  async mounted() {
    this.formData = {
      ...initForm
    }
    if (this.user) {
      this.formData.member_name = {
        _id: this.user._id,
        link: "members",
        display: this.user.name
      }
      this.formData.first_city = this.user.city
    }

    await this.getAllItems({
      parent: "collections",
      child: "cities",
      data: {
        sort: { name: 1 }
      }
    })
  },
  beforeDestroy() {
    this.formData = {
      ...initForm
    }
  }
}
</script>

<style lang="scss" scoped></style>
