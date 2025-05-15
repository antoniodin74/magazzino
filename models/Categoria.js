const mongoose = require('mongoose');

const categoriaSchema = new mongoose.Schema({
    nome: {
        type: String,
        required: true,
        unique: true
    },
    descrizione: {
        type: String
    },
    attiva: {
        type: Boolean,
        default: true
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
});

/* module.exports = mongoose.model('Categoria', categoriaSchema); */
let Categoria = mongoose.model('Categoria', categoriaSchema, 'Categorie')
module.exports = Categoria