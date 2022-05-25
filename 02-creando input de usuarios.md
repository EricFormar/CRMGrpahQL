# Input de Usuario
1. Creo en el *schema* el **UsuarioInput**, definiendo los campos y su correspondiente tipo de datos:
~~~
input UsuarioInput {
    nombre : String!
    apellido : String!
    email : String!
    password : String!
}
~~~
- Al agregarle un signo de exclamación !, decimos que dicho campo es obligatorio.
2. Utilizo el *input* creado para pasarlo como parámetro al correspondiente type *Mutation*:
~~~
type Mutation {
    nuevoUsuario(input : UsuarioInput) : String
}
~~~
- Sigue devolviendo un string
3. El schema quedaría como sigue:
~~~
const {gql} =require('apollo-server');

const typeDefs = gql`

type Usuario {
    nombre : String
    apellido : String
    email : String
    creado : String
}

input UsuarioInput {
    nombre : String!
    apellido : String!
    email : String!
    password : String!
}

type Query {
    mensajeDePrueba : String
}

type Mutation {
    nuevoUsuario(input : UsuarioInput) : String
}

`

module.exports = typeDefs;
~~~
4. Luego reescribo en el resolver el correspondiente Mutation:
~~~
 Mutation : {
        nuevoUsuario : (_,{input}) => {
            
            console.log(input)   
            
            return "Creando un nuevo usuario..."
        }
    }
~~~
- Le paso como segundo parámetro el input y lo muestro por consola.
- Todavía está retornando un string.
5. Para probar en la plataforma de GraphQL creamos el siguiente código:
~~~
mutation nuevoUsuario($input : UsuarioInput) {
  nuevoUsuario(input : $input)
}
~~~
- Declaramos la variable **$input** que recibe como valor el *input* creado en el *schema*.
- Luego se lo paso por parámeto al *Mutation*
- Tenemos que crear el objeto input en las *query variables*. Recordamos que todos los campos son obligatorios:
~~~
{
  "input" : {
    "nombre" : "Eric",
    "apellido" : "Mena",
    "email" : "menaericdaniel@gmail.com",
    "password" : "123123"
  }
}
~~~
6. Ejecutao el *Mutation* arroja el siguiente resultado:
~~~
{
  "data": {
    "nuevoUsuario": "Creando un nuevo usuario..."
  }
}
~~~