# Clientes
## Modelo
~~~
const mongoose = require('mongoose');

const ClienteSchema = mongoose.Schema({
    nombre : {
        type : String,
        required : true, 
        trim : true
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
        unique : true
    },
    empresa : {
        type : String,
        required : true,
        trim : true
    },
    telefono : {
        type : String,
    },
    creado : {
        type : Date,
        default : Date.now(), //valor por defecto
    },
    vendedor : {
        type : mongoose.Schema.Types.ObjectId,
        required : true,
        ref : 'Usuario'
    },
});

module.exports = mongoose.model('Cliente', ClienteSchema);
~~~
## Schema
### Type
~~~
type Cliente {
    id : ID
    nombre : String
    apellido : String
    empres : String
    email : String
    telefono : String
    vendedor : ID
}
~~~
### Input
~~~
input ClienteInput {
    nombre : String!
    apellido : String!
    email : String!
    empresa : String!
    telefono : String
}
~~~
### Mutations
#### Nuevo Cliente
~~~
     nuevoCliente(input : ClienteInput) : Cliente
~~~
#### Actualizar un Cliente 
~~~
    actualizarCliente(id: ID!, input : ClienteInput) : Cliente
~~~
#### Eliminar un Cliente
~~~
    eliminarCliente(id : ID!) : String
~~~
### Queries
#### Obtener TODOS los clientes
~~~
 obtenerClientes : [Cliente]
~~~
#### Obtener UN cliente
~~~
obtenerCliente(id : ID!) : Cliente
~~~
## Resolvers
### Mutations
#### Nuevo Cliente
~~~
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
    }
~~~
- En el **headers de la petición** viene el token, por medio de la cual accedo al ID del usaurio.
- Configuro para que en el context (ctx) venga el *headers* la clave `autorization` en la *configuración del servidor* en `index.js`:
~~~
const server = new ApolloServer({
    typeDefs,
    resolvers,
    context : ({req}) => {
        
        const token = req.headers['authorization'] || '';

        if(token){
            try {
                const usuario = jwt.verify(token, process.env.JWT_SECRET);
                return {
                    usuario
                }
            } catch (error) {
                console.log(error)
                return error
            }
        }
    }
});
~~~
#### Actualizar Cliente
~~~
 actualizarCliente : async (_,{id,input}) => {

            try {
                let cliente = await Cliente.findById(id);

                if(!cliente){
                    throw new Error('cliente no encontrado')
                }
                cliente = await Cliente.findByIdAndUpdate({_id: id}, input, {new : true});

                return cliente;

            } catch (error) {
                console.log(error)
                return error
            }

        },
~~~
#### Eliminar Cliente
~~~
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
~~~
### Queries
#### Obtener TODOS los clientes
~~~
query obtenerClientes{
  obtenerClientes {
    nombre
    apellido
    empresa
    vendedor
  }
}
~~~
#### Obtener UN los cliente
~~~
  obtenerCliente : async (_,{id}) => {
            try {
                const cliente = await Cliente.findById(id);
                if(!cliente){
                    throw new Error('Cliente no encontrado')
                }
                return cliente
            } catch (error) {
                console.log(error)
                return error
            }
        },
~~~
## Ejecutando en la plataforma de Apollo
### Nuevo Cliente
#### Operation
~~~
mutation NuevoCliente ($input : ClienteInput){
  nuevoCliente (input : $input) {
    id
    nombre
    apellido
    vendedor
  }
}
~~~
#### Variables
~~~
{
  "input" : {
    "email": "americo@hotmail.com",
    "nombre": "Américo",
    "apellido": "Muñoz",
    "empresa": "Epuyen S.A."
  }
}
~~~
#### Headers
~~~
{
    Autorization : eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjYyOGUxYzkyZWVmMzE4YzA0YWJiOTY0NSIsImVtYWlsIjoibWVuYWVyaWNAaG90bWFpbC5jb20iLCJub21icmUiOiJFcmljIiwiYXBlbGxpZG8iOiJNZW5hIiwiaWF0IjoxNjUzNzI1MTEzLCJleHAiOjE2NTM4MTE1MTN9.DHFbWy0oApH5Vh2_Ylu_yTz_MyTR-in1SHeNf5SKJ4M
}

~~~
#### Response
~~~
{
  "data": {
    "nuevoCliente": {
      "id": "6291d992181bf8810bcf01cb",
      "nombre": "Américo",
      "apellido": "Muñoz",
      "vendedor": "628e1c92eef318c04abb9645"
    }
  }
}
~~~
### Obtener TODOS los clientes
#### Operation
~~~
query obtenerClientes{
  obtenerClientes {
    nombre
    apellido
    empresa
    vendedor
  }
}
~~~
#### Response
~~~
{
  "data": {
    "obtenerClientes": [
      {
        "nombre": "Paolo",
        "apellido": "Rocca",
        "empresa": "Grupo Techint",
        "vendedor": "628e1c92eef318c04abb9645"
      },
      {
        "nombre": "Américo",
        "apellido": "Muñoz",
        "empresa": "Epuyen S.A.",
        "vendedor": "628e1c92eef318c04abb9645"
      }
    ]
  }
}
~~~
### Obtener UN cliente
#### Operation
~~~
query obtenerCliente($input : ID!){
  obtenerCliente(id : $input) {
    nombre
    apellido
    empresa
    vendedor
  }
}
~~~
#### Variables
~~~
{
  "input" :   "629113c099a04e8f6b23673d"
}
~~~
#### Response
~~~
{
  "data": {
    "obtenerCliente": {
      "nombre": "Paolo",
      "apellido": "Rocca",
      "empresa": "Grupo Techint",
      "vendedor": "628e1c92eef318c04abb9645"
    }
  }
}
~~~
### ACTUALIZAR un cliente
### Schema | Mutation
~~~
    actualizarProducto(id: ID!, input : ProductoInput) : Producto
~~~
### Resolver | Mutation
~~~
    actualizarCliente : async (_,{id,input}) => {

            try {
                let cliente = await Cliente.findById(id);

                if(!cliente){
                    throw new Error('cliente no encontrado')
                }
                cliente = await Cliente.findByIdAndUpdate({_id: id}, input, {new : true});

                return cliente;

            } catch (error) {
                console.log(error)
                return error
            }

        },
~~~
### Ejecución | Operation
~~~
mutation ActualizarCliente($actualizarClienteId: ID!, $input : ClienteInput) {
  actualizarCliente(id: $actualizarClienteId, input : $input) {
    nombre
    apellido
    empresa
  }
}
~~~
### Ejecución | Variables
~~~
{
  "actualizarClienteId": "629113c099a04e8f6b23673d",
  "input": {
    "nombre" : "Pablo",
    "apellido": "Rocca",
    "empresa": "Techint",
    "email": "techint@gmail.com"

  }
}
~~~
### Ejecución | Response
~~~
{
  "data": {
    "actualizarCliente": {
      "nombre": "Pablo",
      "apellido": "Rocca",
      "empresa": "Techint"
    }
  }
}
~~~
## ELIMINAR un cliente
### Schema | Mutation
~~~
    eliminarCliente(id : ID!) : String
~~~
### Resolver | Mutation
~~~
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
~~~
### Ejecución | Operation
~~~
mutation EliminarCliente($eliminarClienteId: ID!) {
  eliminarCliente(id: $eliminarClienteId)
}
~~~
### Ejecución | Variables
~~~
{
  "eliminarClienteId": "629113c099a04e8f6b23673d"
}
~~~
### Ejecución | Response
~~~
{
  "data": {
    "eliminarCliente": "El cliente fue eliminado con éxito!"
  }
}
~~~