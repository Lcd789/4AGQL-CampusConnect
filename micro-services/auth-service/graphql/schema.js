const { GraphQLSchema, GraphQLObjectType } = require("graphql");
const queries = require("./queries");
const mutations = require("./mutations");

// GraphQL Schema
const schema = new GraphQLSchema({
    query: new GraphQLObjectType({
        name: "Query",
        fields: queries,
    }),
    mutation: new GraphQLObjectType({
        name: "Mutation",
        fields: mutations,
    }),
});

module.exports = schema;
