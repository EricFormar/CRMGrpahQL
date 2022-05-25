# Creación de Modelos y Types
1. Crear un carpeta `models` donde se definiran los modelos de la Base de Datos.
2. Crear el archivo `Usuario.js` con el siguiente código:
~~~
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
~~~
- De definen los campos y sus atributos:
    - *type*, se define el tipo de datos que soporta el campo
    - *required*, el campo es requerido
    - *trim*, se borrarán automáticamente los espacios
    - *unique*, no acepta duplicados
    - *default*, se guarda automáticamente un valor por defecto.
3. Definir los *types* en el schema de **GraphQL**
~~~
const {gql} =require('apollo-server');

const typeDefs = gql`

type Usuario {
    id : ID
    nombre : String
    apellido : String
    email : String
    creado : String
}

type Query {
    mensajeDePrueba : String
}

type Mutation {
    nuevoUsuario : String
}

`

module.exports = typeDefs;
~~~
- Primero se define el type Usuario, el cual contiene todos los campos que deseamos mostrar del *Modelo Usuario* junto a el tipo de datos que le corresponde.
- El id será de tipo ID, dado que será un número único creado por MongoDB.
- El campo *creado* será de tipo string, dado que GraphQL NO soporta datos de tipo Date
- Luego definimos los *mutations* en el type *Mutation*, como por ejemplo: `nuevoUsuario` que devolverá por ahora solo un string.
4. Cada vez que se define una *Query* o un *Mutation* en el *Schema* de **GraphQL**, estos deben tener su corrspondiente *resolver*:
~~~
const resolvers = {

    Query : {
        mensajeDePrueba : () => "test"
    },

    Mutation : {
        nuevoUsuario : () => "Creando un nuevo usuario"
    }
}

module.exports = resolvers
~~~
4. Para probar el *Mutation* en la plataforma de Apollo Server, lo haremos de la siguiente manera:
~~~
mutation nuevoUsuario {
  nuevoUsuario
}
~~~
- Es importante señalar que es un *mutation*
5. GraphQL nos dará como respuesta:
~~~
{
  "data": {
    "nuevoUsuario": "Creando un nuevo usuario"
  }
}
~~~
