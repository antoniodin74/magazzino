const mongoose = require('mongoose')
const articoloschema = new mongoose.Schema({
    codiceArticolo: {
        type: String,
        required: true
    },
    descrizioneArticolo: {
        type: String,
        required: true
    },
    quantitàArticolo: {
        type: Number
    },
    costoArticolo: {
        type: Number,
    }
})

let Articolo = mongoose.model('Articolo', articoloschema, 'articoli')

module.exports = Articolo