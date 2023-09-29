const mongoose = require('mongoose')
const ordineschema = new mongoose.Schema({
    codiceOrdine: {
        type: String,
        required: true
    },
    rigaOrdine: {
        type: mongoose.Schema.Types.Decimal128,
        default:0
    },
    codiceArticolo: {
        type: String,
        required: true
    },
    quantitaOrdine: {
        type: mongoose.Schema.Types.Decimal128,
        default:0
    },
    scontoOrdine: {
        type: mongoose.Schema.Types.Decimal128,
        default:0
    },
    valoreOrdine: {
        type: mongoose.Schema.Types.Decimal128,
        default:0
    },
    noteOrdine: {
        type: String,
        default: ''
    },
    clienteOrdine: {
        type: String,
        required: true
    },
    statoOrdine: {
        type: Boolean,
        default: true
    }
})

let Ordine = mongoose.model('Ordine', ordineschema, 'ordini')

module.exports = Ordine