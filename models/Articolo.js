const mongoose = require('mongoose')
const articoloschema = new mongoose.Schema({
    codiceArticolo: {
        type: String,
        required: true,
        unique: true
    },
    descrizioneArticolo: {
        type: String,
        default: '',
        required: true
    },
    categoria: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Categoria', 
        required: true 
    },
    unitaMisura: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'UnitaMisura', 
        required: true 
    },
    quantitaArticolo: {
        type: mongoose.Schema.Types.Decimal128,
        default:0
    },
    costoArticolo: {
        type: mongoose.Schema.Types.Decimal128,
        default:0
    },
    noteArticolo: {
        type: String,
        default: ''
    },
    fotoPathArticolo: {
        type: String,
        default: ''
    },
    statoArticolo: {
        type: Boolean,
        default: true
    },
    createdAt: { 
        type: Date, 
        default: Date.now 
    },
    updatedAt: { 
        type: Date, 
        default: Date.now 
    }
})

let Articolo = mongoose.model('Articolo', articoloschema, 'articoli')

module.exports = Articolo