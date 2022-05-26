# Productos
## Modelo
~~~
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
~~~
## Schema
### Type
~~~
type Producto {
    id: ID
    nombre : String
    existencia : Int
    precio : Float
    creado : String
}
~~~
### Input
~~~
input ProductoInput {
    nombre : String!
    existencia : Int!
    precio : Float!
}
~~~
### Mutations
#### Nuevo Producto
~~~
    nuevoProducto(input : ProductoInput) : Producto
~~~
## Resolvers
### Nuevo Producto
~~~
 nuevoProducto : async (_,{input}) => {
            
            try {
                const producto  = new Producto(input);
                producto.save();

                return producto
            } catch (error) {
                console.log(error)
            }
        },
~~~
### Ejecutando en la plataforma de Apollo
#### Operation
~~~
mutation nuevoProducto($input : ProductoInput){
  nuevoProducto(input : $input) {
      id
      nombre
      existencia
      precio
      creado
  }
}
~~~
#### Variables
~~~
{
  "input" : {
    "nombre" : "MacBook Air 13",
    "existencia": 50,
    "precio": 150000
  }
}
~~~
#### Response
~~~
{
  "data": {
    "nuevoProducto": {
      "id": "628ec63ea23083ce97991c49",
      "nombre": "MacBook Air 13",
      "existencia": 50,
      "precio": 150000,
      "creado": "1653523305863"
    }
  }
}
~~~
