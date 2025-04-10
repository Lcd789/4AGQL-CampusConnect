const {
    GraphQLID,
    GraphQLNonNull,
    GraphQLList,
    GraphQLString,
} = require("graphql");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const { UserType } = require("./types");

const queries = {
    /**
     * Query to get the currently authenticated user's information.
     * Requires a valid JWT token in the Authorization header.
     * @example
     * query {
     *   me {
     *     id
     *     email
     *     username
     *     role
     *   }
     * }
     * @returns {UserType} - Returns the authenticated user's information
     */
    me: {
        type: UserType,
        description: "Get the currently authenticated user's information",
        resolve: async (_, __, { user }) => {
            if (!user) {
                throw new Error("Not authenticated");
            }
            return user;
        },
    },


    /**
     * Query to fetch a specific user by their ID.
     * Requires authentication.
     * @example
     * query {
     *   user(id: "60d5ec7c82b2f0001e5d6f42") {
     *     id
     *     email
     *     username
     *     role
     *   }
     * }
     * @returns {UserType} - Returns the user with the specified ID
     */
    user: {
        type: UserType,
        description: "Fetch a user by their ID (requires authentication)",
        args: {
            id: {
                type: new GraphQLNonNull(GraphQLID),
                description: "The ID of the user to fetch"
            },
        },
        resolve: async (_, { id }, { user }) => {
            if (!user) {
                throw new Error("Not authenticated");
            }

            const foundUser = await User.findById(id);
            if (!foundUser) {
                throw new Error("User not found");
            }

            return foundUser;
        },
    },


    /**
     * Query to fetch all users in the system.
     * Restricted to users with the 'professor' role.
     * @example
     * query {
     *   users {
     *     id
     *     email
     *     username
     *     role
     *   }
     * }
     * @returns {[UserType]} - Returns a list of all users
     */
    users: {
        type: new GraphQLList(UserType),
        description: "Fetch all users (restricted to professors)",
        resolve: async (_, __, { user }) => {
            if (!user || user.role !== "professor") {
                throw new Error("Not authorized");
            }

            return User.find({});
        },
    },


    /**
     * Query to validate a JWT token and return the associated user.
     * Does not require prior authentication as it's used for validating tokens.
     * @example
     * query {
     *   validateToken(token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...") {
     *     id
     *     email
     *     username
     *     role
     *   }
     * }
     * @returns {UserType} - Returns the user associated with the token
     */
    validateToken: {
        type: UserType,
        description: "Validate a JWT token and return the associated user",
        args: {
            token: {
                type: new GraphQLNonNull(GraphQLString),
                description: "JWT token to validate"
            },
        },
        resolve: async (_, { token }) => {
            try {
                const decoded = jwt.verify(token, process.env.JWT_SECRET);
                const foundUser = await User.findById(decoded.userId);

                if (!foundUser) {
                    throw new Error("User not found");
                }

                return foundUser;
            } catch (error) {
                throw new Error("Invalid token");
            }
        },
    },

};

module.exports = queries;
