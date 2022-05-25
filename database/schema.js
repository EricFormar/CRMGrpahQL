const {gql} =require('apollo-server');

const typeDefs = gql`

type Query {
    mensajeDePrueba : String
}

`

module.exports = typeDefs;