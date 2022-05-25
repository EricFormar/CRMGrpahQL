# Insertar un Usuario en la DB

## Crear el Mutation

1. Aplico destructuring del _input_ extrayendo email y password: `const {email, password} = input;`
2. Busco si el email está regisrado previamente: `const existeUsuario = await Usuario.findOne({email});`
3. En el caso que esté registrado lanzo un error: `if(existeUsuario){throw new Error('El usuario ya está registrado')};`
4. Una vez instalada la dependencia para hashear la constraseña `npm i bcryptjs` requiero dicho módulo: `const bcrcyptjs = require('bcryptjs');` para hashear la contraseña, antes de guardar en la base de datos: `input.password = await bcrcyptjs.hash(password, 10);`
4. En un try...catch, creo una nueva instancia del modelo _Usuario_, el cual recibe por parámetro el _input_
5. Salvo los cambios utilizanod el método _save()_ de **mongoose**.
6. Retorno el usuario el cual se ajusta al type declarado en el _schema_, exponiendo solo los campos que allí de definen.

```
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
```

7. Ahora en el **Mutation**, le decimos que retorne un _Usuario_ basado en type _Usuario_ que hemos definido anteriormente.

```
type Mutation {
    nuevoUsuario(input : UsuarioInput) : Usuario
}
```

- Es decir el **Mutation** recibe el input _UsuarioInput_, cuyos campos se utilizan en el momento de guardar la información, y devuelve los campos seteados en el type _Usuario_.

## Ejecutar el Mutation

1. Ejecuto el **Mutation** pasando recibiendo en la variable **$input** la información para ser procesa y luego elijo qué campos de los que el type _Usuario_ me ofrece para mostrar.

```
mutation nuevoUsuario($input : UsuarioInput) {
  nuevoUsuario(input : $input){
    id
    nombre
    apellido
    email
  }
}
```

2. Al pasar el _input_ como variable, me devuelve lo siguiente:

```
{
  "data": {
    "nuevoUsuario": {
      "id": "628d269e80d9af36b112a35e",
      "nombre": "Eric",
      "apellido": "Mena",
      "email": "menaeric@hotmail.com"
    }
  }
}
```

3. Sin embargo se guardará de la siguiente manera en MongoDB:

```
{
  "_id": {
    "$oid": "628e1c92eef318c04abb9645"
    },
  "nombre": "Eric",
  "apellido": "Mena",
  "email": "menaeric@hotmail.com",
  "password": "$2a$10$D7WT3QGDtIqdB6bGjaY0LO/AvAaKU9jAI0BAc/N.V8Vrb.7eF48ZS",  "creado": {
    "$date": {
      "$numberLong": "1653480591172"
      }
    },
  "__v": 0
  }
```
