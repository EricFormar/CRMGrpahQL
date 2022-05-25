const mongoose = require('mongoose');

const UsuarioSchema = mongoose.Schema({
    nombre : {
        type : String,
        required : true, //requerido
        trim : true //trimea automáticamente
    },
    apellido : {
        type : String,
        required : true,
        trim : true
    },
    email : {
        type : String,
        required : true,
        trim : true,
        unique : true //un email único
    },
    password : {
        type : String,
        required : true,
        trim : true
    },
    creado : {
        type : Date,
        default : Date.now(), //valor por defecto
    }
});

module.exports = mongoose.model('Usuario', UsuarioSchema);