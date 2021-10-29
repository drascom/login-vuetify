/* eslint-disable no-unused-vars */
const productionGzipExtensions = ["js", "css"]
const path = require("path")
module.exports = {
    publicPath: process.env.NODE_ENV === "production" ? "/dad" : "/",
    outputDir: "dad",
    transpileDependencies: ["vuetify"],
    chainWebpack: (config) => {
        config.plugin("html").tap((args) => {
            args[0].title = "DAD Network"
            return args
        })
    }
}