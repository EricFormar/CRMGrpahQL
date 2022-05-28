const bcrcyptjs = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Usuario = require('../models/Usuario');
const Producto = require('../models/Producto');
const Cliente = require('../models/Cliente');

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
        },

        /* CLIENTES */
        obtenerClientes : async (_,{},ctx) => {
            try {
                const clientes = await Cliente.find({vendedor: ctx.usuario.id.toString()});
                return clientes
            } catch (error) {
                console.log(error)
                return error
            }
        },
        obtenerCliente : async (_,{id},ctx) => {
            try {
                const cliente = await Cliente.findById(id);
                if(!cliente){
                    throw new Error('Cliente no encontrado')
                }
                if(cliente.vendedor.toString() !== ctx.usuario.id){
                    throw new Error('No tienes las credenciales')
                }
                return cliente
            } catch (error) {
                console.log(error)
                return error
            }
        },
    },

    Mutation : {
        /* USUARIOS */
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
        /* PRODUCTOS */
        nuevoProducto : async (_,{input}) => {
            
            try {
                const producto  = new Producto(input);
                producto.save();

                return producto
            } catch (error) {
                console.log(error)
            }
        },
        actualizarProducto : async (_,{id,input}) => {

            try {
                let producto = await Producto.findById(id);

                if(!producto){
                    throw new Error('Producto no encontrado')
                }
                producto = await Producto.findByIdAndUpdate({_id: id}, input, {new : true});

                return producto;

            } catch (error) {
                console.log(error)
                return error
            }

        },
        eliminarProducto : async (_,{id}) => {

            try {
                let producto = await Producto.findById(id);

                if(!producto){
                    throw new Error('Producto no encontrado')
                }
                await Producto.findByIdAndDelete({_id: id});

                return "El producto fue eliminado con éxito!"

            } catch (error) {
                console.log(error)
                return error
            }

        },
        /* CLIENTES */
        nuevoCliente : async (_,{input},ctx) => {
            const {email} = input;
            const cliente = await Cliente.findOne({email});
            
            if(cliente) {
                throw new Error('El cliente ya está registrado')
            };

            try {
                const cliente  = new Cliente(input);
                cliente.vendedor = ctx.usuario.id;

                cliente.save();

                return cliente
            } catch (error) {
                console.log(error)
                return error
            }
        },
        actualizarCliente : async (_,{id,input},ctx) => {

            try {
                let cliente = await Cliente.findById(id);

                if(!cliente){
                    throw new Error('cliente no encontrado')
                }

                if(cliente.vendedor.toString() !== ctx.usuario.id){
                    throw new Error('No tienes las credenciales')
                }
                
                cliente = await Cliente.findByIdAndUpdate({_id: id}, input, {new : true});

                return cliente;

            } catch (error) {
                console.log(error)
                return error
            }

        },
        eliminarCliente : async (_,{id}) => {

            try {
                let cliente = await Cliente.findById(id);

                if(!cliente){
                    throw new Error('Cliente no encontrado')
                }
                await Cliente.findByIdAndDelete({_id: id});

                return "El cliente fue eliminado con éxito!"

            } catch (error) {
                console.log(error)
                return error
            }

        },
    }
}

module.exports = resolvers