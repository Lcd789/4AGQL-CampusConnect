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
    // Query to get the authenticated user's information
    me: {
        type: UserType,
        resolve: async (_, __, { user }) => {
            if (!user) {
                throw new Error("Not authenticated");
            }
            return user;
        },
    },

    // Query to fetch a user by ID
    user: {
        type: UserType,
        args: {
            id: { type: new GraphQLNonNull(GraphQLID) },
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

    // Query to fetch all users (restricted to professors)
    users: {
        type: new GraphQLList(UserType),
        resolve: async (_, __, { user }) => {
            if (!user || user.role !== "professor") {
                throw new Error("Not authorized");
            }

            return User.find({});
        },
    },

    // Query to validate a JWT token and return the associated user
    validateToken: {
        type: UserType,
        args: {
            token: { type: new GraphQLNonNull(GraphQLString) },
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
