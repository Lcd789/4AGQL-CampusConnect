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

/**
 * Type representing the authentication payload returned after login/register operations
 */
const AuthPayloadType = new GraphQLObjectType({
    name: "AuthPayload",
    description: "Authentication payload containing JWT token and user information",
    fields: () => ({
        token: {
            type: GraphQLString,
            description: "JWT token for authenticated requests"
        },
        user: {
            type: UserType,
            description: "The authenticated user information"
        }
    })
});

module.exports = { UserType, AuthPayloadType };

