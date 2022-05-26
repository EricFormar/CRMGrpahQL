const bcrcyptjs = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Usuario = require('../models/Usuario');
const Producto = require('../models/Producto');


const crearToken = (usuario,secreta,expiresIn) => {
    
    const {id,email,nombre,apellido} = usuario;

    return jwt.sign({id,email,nombre,apellido},secreta,{expiresIn})

}

const resolvers = {

    Query : {
        obtenerUsuario : async(_,{token}) => {
            const usuarioId = await jwt.verify(token, process.env.JWT_SECRET);
            return usuarioId
        },
        obtenerProductos : async () => {
            try {
                const productos = await Producto.find({});
                return productos
            } catch (error) {
                console.log(error)
                return error
            }
        },
        obtenerProducto : async (_,{id}) => {
            try {
                const producto = await Producto.findById(id);
                console.log(producto)
                if(!producto){
                    throw new Error('Producto no encontrado')
                }
                return producto
            } catch (error) {
                console.log(error)
                return error
            }
        }
    },

    Mutation : {
        //usuarios
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
        },

        autenticarUsuario : async (_,{input}) => {
            
            const {email, password} = input;
            const usuario = await Usuario.findOne({email});
            
            if(!usuario) {
                throw new Error('El usuario no está registrado')
            };

            const passwordCorrecto = await bcrcyptjs.compare(password,usuario.password);

            if(!passwordCorrecto) {
                throw new Error('La contraseña no es correcta')
            };

            return {
                token : crearToken(usuario,process.env.JWT_SECRET,'24h')
            }

        },
        //productos
        nuevoProducto : async (_,{input}) => {
            
            try {
                const producto  = new Producto(input);
                producto.save();

                return producto
            } catch (error) {
                console.log(error)
            }
        },
    }
}

module.exports = resolvers