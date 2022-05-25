# Implementación de MongoDB Atlas y MongoDB Compass
1. [Crear](https://www.mongodb.com/es/cloud/atlas/register) una cuenta en **MongoDB** o [ingresar](https://account.mongodb.com/account/login) si ya tiene una.
2. Instalar [MongoDB Compass](https://www.mongodb.com/try/download/compass).
3. Crear un nuevo [cluster](https://cloud.mongodb.com/v2/628c625a94093c26ba0b5732#clusters/pathSelector)
4. Crear un las credenciales de [accesso](https://cloud.mongodb.com/v2/628c625a94093c26ba0b5732#setup/access?includeToast=true)
5. [Conectar](https://cloud.mongodb.com/v2/628c625a94093c26ba0b5732#clusters/connect?clusterId=Cluster0) añadiendo la IP.
6. Copiar los datos de conexión reemplazando usuario y contraseña por las credenciales de acceso creadas en el paso 4 `mongodb+srv://root:<password>@cluster0.5srdy.mongodb.net/test`
7. Usar los datos de conexión en **MongoDB Compass**.
8. Crear la base de datos *CRMGraphQL* y la colección *clientes*.
# Implementación de Mongoose
1. Instalar la dependencia de [Mongoose](https://mongoosejs.com/): `npm i mongoose`
2. Instalar la dependencia *dotenv* `npm i dotenv`
3. Crear el archivo `.env` con las siguientes variables de entorno:
~~~
DB_MONGO=mongodb+srv://<usuario>:<contraseña>@cluster0.5srdy.mongodb.net/CRMGraphQL
~~~
3. Crear un carpeta `config` y dentro de ella el archivo `db.js` con el siguiente código:
~~~
const mongoose = require('mongoose');
require('dotenv').config({path : '.env'});

const conectarDB = async () => {
    try {

        await mongoose.connect(process.env.DB_MONGO,{
           //configuraciones
        })
        console.log('DB conectada con éxito')
    } catch (error) {
        console.log('Ups, hubo un error');
        console.log(error);
        process.exit(1); //detengo la app
    }
}

module.exports = conectarDB;
~~~
- Se require mongoose y dotenv.
- Se crea una función asincrónica la cual prueba hacer la conexión con mongoDB utilizando el método *connect* de mongoose, el cual recibe como parámetro la URL de conexión guardada en la variable de entorno.
- Si hay algun error, este se mostrará por consola y se detendrá la ejecución de la aplicación.