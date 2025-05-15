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
    telefono: {
        type: Number,
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
    },
    tokenMail: {
        type: String,
        default: ''
    },
    partner: {
        type: String,
        default: ''
    },
    resetTokenExpires: {
         type: Date
    },
    creatoDa: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Utente',
        default: null
    },
    modificatoDa: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Utente',
        default: null
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

let Utente = mongoose.model('Utente', utenteschema, 'utenti')

module.exports = Utente