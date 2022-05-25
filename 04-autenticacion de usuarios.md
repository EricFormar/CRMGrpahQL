# Autenticación con JWT
## Crear un Token con JWT
1. Creo una nueva *Mutation* que recibe un input *AutenticarInput* y devuelve un valor de type *Token*: `autenticarUsuario(input : AutenticarInput) : Token`
2. Creo el input *AutenticarInput* que recibe obligatoriamente un email y password, ambos de tipo de datos String:
~~~
input AutenticarInput {
    email : String!
    password : String!
}
~~~
3. Defino el type *Token*:
~~~
type Token {
    token : String
}
~~~
4. Creo un nuevo *resolver* que recibe el input, comprobando si el email está registrado y la contraseña sea la correcta, caso contrario arrojará un error:
~~~
  autenticarUsuario : async (_,{input}) => {
            
    const {email, password} = input;

    const usuario = await Usuario.findOne({email});
    
    if(!usuario) {
        throw new Error('El usuario no está registrado')
    };

    const passwordCorrecto = await bcrcyptjs.compare(password.usuario.password);

    if(!passwordCorrecto) {
        throw new Error('La contraseña no es correcta')
    };
}
~~~
5. Instalar la dependencia JSON Web Token `npm i jsonwebtoken` y requerirla en el resolver: `const jwt = require('jsonwebtoken');`
6. Crear una variable de entorno llamada JWT_SECRET: `JWT_SECRET=p@l@br@s3kr3T@`
7. Se puede requerir el acceso a las variables de entorno desde el `index.js` escribiendo: `require('dotenv').config({path : '.env'});`
8. Crear una función que recibe los datos del usuario, la palabra secreta para desencriptar el token y el tiempo de expiración. La misma retornará la creación del token, utilizando el método **sign** de JSON Web Token. El mismo recibe los parámetros antes mencionados según al sintaxis
~~~
const crearToken = (usuario,secreta,expiresIn) => {
    
    const {id,email,nombre,apellido} = usuario

    return jwt.sign({id,email,nombre,apellido},secreta,{expiresIn})

}
~~~
9. Finalmente hago que el *mutation* **autenticarUsuario** retorne el *token*, utilizando para ello la función creada anteriormente, pasandole por parámetro los argumentos que la misma precisa para generar el token.
~~~
  return {
        token : crearToken(usuario,process.env.JWT_SECRET,'24h')
    }
~~~
10. Para ejercutar en la plataforma invoco a la mutation de la siguiente manera: 
~~~
mutation autenticarUsuario($input : AutenticarInput){
  autenticarUsuario(input : $input) {
    token
  }
}
~~~
- Como input paso la siguiente data:
    ~~~
    {
    "input" : {
        "email" : "menaeric@hotmail.com",
        "password" : "123123"
    }
    }
    ~~~
- Esto me devolverá lo siguiente:
    ~~~
    {
    "data": {
        "autenticarUsuario": {
        "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjYyOGUxYzkyZWVmMzE4YzA0YWJiOTY0NSIsImlhdCI6MTY1MzQ3Mjc4MiwiZXhwIjoxNjUzNTU5MTgyfQ.ChdBTY0lXNq7QjwOEl4GXJdje63k2BGba3Xt1Dzy3Qs"
        }
    }
    }
    ~~~
11. Puedo desencriptar el token la página de [JWT](https://jwt.io/) para ver el contenido del Payload
## Autenticar el usaurio usando un Token con JWT
1. Creo un neuvo Query en el schema: 
~~~
type Query {
    obtenerUsuario(token : String!) : Usuario
}
~~~
- El query recibe como parámetro un token de tipo de datos String y obligatorio.
- Devuelve lo determinado en el type Usuario
2. Creo el correspondiente resolver:
~~~
  Query : {
        obtenerUsuario : async(_,{token}) => {

            const usuario = await jwt.verify(token, process.env.JWT_SECRET);

            return usuario

        }
    },
~~~
- Debe recibir el token
- Utilizando el método verify de JWT verifico si el toquen ingresado es válido. Para ello además de recibir el token, leo de las variables de entorno la clave secreta.
- Si está todo correcto, devolverá un Usuario.
3. Para probar la funcionalidad ejecuto en la plataforma de la siguiente forma:
~~~
query obtenerUsuario($token : String!){
  obtenerUsuario(token : $token) {
    id
  }
}
~~~
- Recibo el token por parámetro y luego solo devuelvo en este caso el id del usuario.
- Utilizo un token válido para hacer la consulta.