const { GraphQLSchema, GraphQLObjectType } = require("graphql");
const queries = require("./queries");
const mutations = require("./mutations");

/**
 * GraphQL Schema for the CampusConnect authentication service
 * This schema defines all the available queries and mutations
 * for user authentication and management
 */

const schema = new GraphQLSchema({
    query: new GraphQLObjectType({
        name: "Query",
        description: "The root query type for the CampusConnect authentication service",
        fields: queries,
    }),
    mutation: new GraphQLObjectType({
        name: "Mutation",
        description: "The root mutation type for the CampusConnect authentication service",
        fields: mutations,
    }),
});

module.exports = schema;

