<template>
  <v-container>
    <v-row>
      <v-col
        cols="12"
        :sm="$vuetify.breakpoint.xs ? '12' : '8'"
        class="mx-auto"
      >
        <v-card flat tile>
          <v-card-text v-show="!kontrolEt">
            <h1 class="text-center display-2 teal--text text--accent-3 mb-8">
              İstek Oluştur.
            </h1>
            <h5 class="">
              Bu form hiçbir yere kaydedilmez,
              <br />
              KONTROL ET butonuna bastığınızda formunuzu resim formatında
              görüntüler
              <br />
              KAYDET butonuna bastığınızda resim dosyasını indirip ilgili
              whatsapp grubuna göndermenizi sağlar.
            </h5>
            <v-form v-model="isFormValid">
              <v-autocomplete
                v-model="form.basvuru_sehri"
                :items="iller"
                hint=" Şehirinizi  Seçiniz"
                prepend-icon="apartment"
                persistent-hint
                chips
                small-chips
                label="Sizin Şehriniz"
                class="pt-4 my-2"
              ></v-autocomplete>
              <v-autocomplete
                v-model="form.istek_sehri"
                :items="iller"
                hint="İstek Yapılacak Şehir Seçiniz"
                prepend-icon="apartment"
                persistent-hint
                chips
                small-chips
                label="İstek Yapılan Şehir"
              ></v-autocomplete>
              <v-text-field
                label="Hastane Adı"
                name="hastane"
                autocomplete="new-password"
                prepend-icon="local_hospital"
                type="text"
                color="teal accent-3"
                v-model="form.hastane"
              />
              <v-text-field
                label="Hasta Adı"
                name="hasta_adi"
                :rules="inputRules"
                autocomplete="new-password"
                prepend-icon="person"
                type="text"
                color="teal accent-3"
                v-model="form.hasta_adi"
              />
              <v-text-field
                label="Yakınlık Derecesi"
                name="kinship"
                :rules="inputRules"
                autocomplete="new-password"
                prepend-icon="person"
                type="text"
                color="teal accent-3"
                v-model="form.yakınlık"
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
                label="Başvuran Adı Soyadı"
                name="name"
                prepend-icon="person"
                placeholder=""
                :rules="inputRules"
                autocomplete="new-password"
                type="text"
                color="teal accent-3"
                v-model="form.başvuru_sahibi"
              />
              <v-text-field
                label="E-mail"
                name="Email"
                autocomplete="new-password"
                prepend-icon="email"
                type="text"
                color="teal accent-3"
                v-model="form.email"
              />
              <v-text-field
                label="Telefon Numaranız"
                name="phone"
                :rules="inputRules"
                autocomplete="new-password"
                prepend-icon="phone"
                type="text"
                color="teal accent-3"
                v-model="form.telefon"
              />
            </v-form>
          </v-card-text>
          <v-card-text v-show="kontrolEt" ref="capture" id="capture">
            <v-list dense>
              <v-list-item v-for="(value, key) in form" :key="key">
                <v-list-item-content>
                  <v-list-item-title class="text-left text-capitalize">
                    {{ key.replace(/_/g, " ") }} : </v-list-item-title
                  ><span> {{ value }} </span>
                </v-list-item-content>
              </v-list-item>
            </v-list>
          </v-card-text>

          <v-card-actions class="d-flex justify-space-between">
            <v-btn
              :dark="isFormValid"
              color="orange accent-3"
              @click="kontrolEt = !kontrolEt"
              :disabled="!isFormValid"
            >
              {{ kontrolEt ? "Değiştir" : "Kontrol Et" }}
            </v-btn>
            <span v-if="!isFormValid"> Formunuzda Eksikler var</span>
            <v-btn
              dark
              color="blue accent-3"
              @click="onCapture"
              :disabled="capturing || !kontrolEt"
            >
              {{ capturing ? "Kaydediliyor..." : "Kaydet" }}
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import * as htmlToImage from "html-to-image"
export default {
  name: "requestForm",
  methods: {
    onCapture() {
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
  mounted() {
    this.$vuetify.goTo(0)
  },
  data: () => ({
    error: "",
    intro: true,
    capturing: false,
    isFormValid: false,
    kontrolEt: false,
    showPass: true,
    form: {
      basvuru_sehri: null,
      istek_sehri: null,
      hastane: "",
      hasta_adi: "",
      yakınlık: "",
      problem: "",
      başvuru_sahibi: "",
      telefon: "",
      email: ""
    },
    inputRules: [(v) => !!v || "Bu alan gerekli"],
    emailRules: [
      (v) => !!v || "Bu alan gerekli",
      (v) =>
        !v ||
        /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(v) ||
        "E-mail geçersiz"
    ],
    iller: [
      "",
      "Adana",
      "Adıyaman",
      "Afyon",
      "Ağrı",
      "Amasya",
      "Ankara",
      "Antalya",
      "Artvin",
      "Aydın",
      "Balıkesir",
      "Bilecik",
      "Bingöl",
      "Bitlis",
      "Bolu",
      "Burdur",
      "Bursa",
      "Çanakkale",
      "Çankırı",
      "Çorum",
      "Denizli",
      "Diyarbakır",
      "Edirne",
      "Elazığ",
      "Erzincan",
      "Erzurum",
      "Eskişehir",
      "Gaziantep",
      "Giresun",
      "Gümüşhane",
      "Hakkari",
      "Hatay",
      "Isparta",
      "Mersin",
      "İstanbul",
      "İzmir",
      "Kars",
      "Kastamonu",
      "Kayseri",
      "Kırklareli",
      "Kırşehir",
      "Kocaeli",
      "Konya",
      "Kütahya",
      "Malatya",
      "Manisa",
      "Kahramanmaraş",
      "Mardin",
      "Muğla",
      "Muş",
      "Nevşehir",
      "Niğde",
      "Ordu",
      "Rize",
      "Sakarya",
      "Samsun",
      "Siirt",
      "Sinop",
      "Sivas",
      "Tekirdağ",
      "Tokat",
      "Trabzon",
      "Tunceli",
      "Şanlıurfa",
      "Uşak",
      "Van",
      "Yozgat",
      "Zonguldak",
      "Aksaray",
      "Bayburt",
      "Karaman",
      "Kırıkkale",
      "Batman",
      "Şırnak",
      "Bartın",
      "Ardahan",
      "Iğdır",
      "Yalova",
      "Karabük",
      "Kilis",
      "Osmaniye",
      "Düzce"
    ]
  })
}
</script>

<style lang="scss" scoped></style>
