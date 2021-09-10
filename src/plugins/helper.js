export default {
    generateCode(length) {
        let characters = "a-z,A-Z,0-9"
        let charactersArray = characters.split(",")
        let CharacterSet = ""
        let code = ""

        if (charactersArray.indexOf("a-z") >= 0) {
            CharacterSet += "abcdefghijklmnopqrstuvwxyz"
        }
        if (charactersArray.indexOf("A-Z") >= 0) {
            CharacterSet += "ABCDEFGHIJKLMNOPQRSTUVWXYZ"
        }
        if (charactersArray.indexOf("0-9") >= 0) {
            CharacterSet += "0123456789"
        }
        if (charactersArray.indexOf("#") >= 0) {
            CharacterSet += "![]{}()%&*$#^<>~@|"
        }

        for (let i = 0; i < length; i++) {
            code += CharacterSet.charAt(
                Math.floor(Math.random() * CharacterSet.length)
            )
        }
        return code
    },
    timestampConvert(time) {
        const milliseconds = time * 1000
        const dateObject = new Date(milliseconds)
        return dateObject
    },
    uppercase(val) {
        return val.toUpperCase()
    }
}