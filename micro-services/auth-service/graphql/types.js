const { GraphQLObjectType, GraphQLString, GraphQLID } = require("graphql");

// GraphQL Types
const UserType = new GraphQLObjectType({
    name: "User",
    description: "A user of the CampusConnect platform",
    fields: () => ({
        id: { type: GraphQLID, description: "User ID" },
        email: { type: GraphQLString, description: "User email" },
        username: { type: GraphQLString, description: "Username" },
        role: {
            type: GraphQLString,
            description: "Role: student or professor",
        },
    }),
});

const AuthPayloadType = new GraphQLObjectType({
    name: "AuthPayload",
    fields: () => ({
        token: { type: GraphQLString },
        user: { type: UserType }
    })
});

module.exports = { UserType, AuthPayloadType };
