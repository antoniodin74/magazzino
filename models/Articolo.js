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
        type: mongoose.Schema.Types.Decimal128,
        default:0
    },
    costoArticolo: {
        type: Number,
        min:0,
        max: 9999999999
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