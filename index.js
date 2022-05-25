const {ApolloServer} = require('apollo-server');

const typeDefs = require('./database/schema');
const resolvers = require('./database/resolvers');

const conectarDB = require('./config/db');

//conectar DB
conectarDB();

//configuración del servidor
const server = new ApolloServer({
    typeDefs,
    resolvers,
    context : () => {
        const myContext = "Contexto de prueba"

        return {
            myContext
        }
    }
});

//levantar el servidor
server.listen().then(({url}) => {
    console.log(`Server running on ${url}`)
})