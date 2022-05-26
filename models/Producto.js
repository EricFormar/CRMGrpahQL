const mongoose = require('mongoose');

const ProductoSchema = mongoose.Schema({
    nombre : {
        type : String,
        required : true, //requerido
        trim : true //trimea automáticamente
    },
    existencia : {
        type : Number,
        required : true,
        trim : true
    },
    precio : {
        type : Number,
        required : true,
        trim : true
    },
    creado : {
        type : Date,
        default : Date.now(), //valor por defecto
    }
});

module.exports = mongoose.model('Producto', ProductoSchema);