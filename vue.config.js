const productionGzipExtensions = ["js", "css"]
const path = require("path")

module.exports = {
    transpileDependencies: ["vuetify"],
    chainWebpack: (config) => {
        config.plugin("html").tap((args) => {
            args[0].title = "Ederra Stok Takip"
            return args
        })
    }
}