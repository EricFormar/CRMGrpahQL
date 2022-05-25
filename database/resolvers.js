const bcrcyptjs = require('bcryptjs');
const Usuario = require('../models/Usuario');

const resolvers = {

    Query : {
        mensajeDePrueba : () => "test"
    },

    Mutation : {
        nuevoUsuario : async (_,{input}) => {
            
            const {email, password} = input;

            const existeUsuario = await Usuario.findOne({email});
            
            if(existeUsuario) {
                throw new Error('El usuario ya está registrado')
            };

            input.password = await bcrcyptjs.hash(password, 10);

            try {
                const usuario  = new Usuario(input);
                usuario.save();

                return usuario
            } catch (error) {
                console.log(error)
            }
        }
    }
}

module.exports = resolvers