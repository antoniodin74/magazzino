const mongoose = require('mongoose')
const utenteschema = new mongoose.Schema({
    nome: {
        type: String,
        required: true
    },
    cognome: {
        type: String,
        required: true
    },
    indirizzo: {
        type: String,
    },
    citta: {
        type: String,
    },
    cap: {
        type: String,
    },
    piva: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    note: {
        type: String,
        default: ''
    },
    fotoPath: {
        type: String,
        default: ''
    },
    tipo: {
      type: String,
      default: ''
    },
    stato: {
        type: Boolean,
        default: true
      }
})

let Utente = mongoose.model('Utente', utenteschema, 'utenti')

module.exports = Utente