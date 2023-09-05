const mongoose = require('mongoose')
const articoloschema = new mongoose.Schema({
    codiceArticolo: {
        type: String,
        required: true
    },
    descrizioneArticolo: {
        type: String,
        default: ''
    },
    quantitaArticolo: {
        type: Number,
        default: 0
    },
    costoArticolo: {
        type: Number,
        default: 0
    },
    noteArticolo: {
        type: String,
        default: ''
    },
    fotoPathArticolo: {
        type: String,
        default: ''
    }
})

let Articolo = mongoose.model('Articolo', articoloschema, 'articoli')

module.exports = Articolo