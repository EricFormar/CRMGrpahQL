require('dotenv').config({path : '.env'});
const {ApolloServer} = require('apollo-server');
const jwt = require('jsonwebtoken');
const typeDefs = require('./database/schema');
const resolvers = require('./database/resolvers');

const conectarDB = require('./config/db');

//conectar DB
conectarDB();

//configuración del servidor
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

//levantar el servidor
server.listen().then(({url}) => {
    console.log(`Server running on ${url}`)
})