const mongoose = require('mongoose');

const unitaMisuraSchema = new mongoose.Schema({
    sigla: {
        type: String,
        required: true,
        unique: true
    }, // es. "kg", "l"
    descrizione: { 
        type: String, 
        required: true 
    },         // es. "chilogrammi"
    tipo: { 
        type: String, 
        enum: ['peso', 'volume', 'unità'], 
        required: true 
    },
    attiva: { 
        type: Boolean, 
        default: true 
    }
});

/* module.exports = mongoose.model('UnitaMisura', unitaMisuraSchema); */
let UnitaMisura = mongoose.model('UnitaMisura', unitaMisuraSchema, 'UnitaMisure')
module.exports = UnitaMisura
