const mongoose = require('mongoose')
const contatoreschema = new mongoose.Schema({
    collezione: {
        type: String,
    },
    valoreContatore: {
        type: Number
    }
})

let Contatore = mongoose.model('Contatore', contatoreschema, 'contatori')

module.exports = Contatore