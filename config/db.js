const mongoose = require('mongoose');

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