const {GraphQLNonNull, GraphQLString, GraphQLBoolean} = require("graphql");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const {UserType, AuthPayloadType} = require("./types");
const {GraphQLID} = require("graphql/type");

const mutations = {
    /**
     * Mutation to register a new user.
     * @returns {AuthPayloadType} - Returns a JWT token and the created user.
     */
    register: {
        type: AuthPayloadType,
        description: "Register a new user and receive a JWT token",
        args: {
            email: {type: new GraphQLNonNull(GraphQLString)},
            username: {type: new GraphQLNonNull(GraphQLString)},
            password: {type: new GraphQLNonNull(GraphQLString)},
            role: {type: GraphQLString},
        },
        resolve: async (_, {email, username, password, role}) => {
            // Check if a user with the given email already exists
            const existingUser = await User.findOne({email});
            if (existingUser) {
                throw new Error("User already exists with this email");
            }

            // Hash the user's password
            const hashedPassword = await bcrypt.hash(password, 10);

            // Create a new user
            const user = new User({
                email,
                username,
                password: hashedPassword,
                role: role || "student", // Default role is "student"
            });

            await user.save();

            // Generate a JWT token for the user
            const token = jwt.sign(
                {userId: user.id},
                process.env.JWT_SECRET,
                {expiresIn: "1d"} // Token expires in 1 day
            );

            return {
                token,
                user,
            };
        },
    },

    /**
     * Mutation to log in an existing user.
     * @returns {AuthPayloadType} - Returns a JWT token and the authenticated user.
     */
    login: {
        type: AuthPayloadType,
        description: "Log in an existing user and receive a JWT token",
        args: {
            email: {type: new GraphQLNonNull(GraphQLString)},
            password: {type: new GraphQLNonNull(GraphQLString)},
        },
        resolve: async (_, {email, password}) => {
            // Find the user by email
            const user = await User.findOne({email});
            if (!user) {
                throw new Error("Invalid credentials");
            }

            // Verify the provided password
            const valid = await bcrypt.compare(password, user.password);
            if (!valid) {
                throw new Error("Invalid credentials");
            }

            // Generate a JWT token for the user
            const token = jwt.sign(
                {userId: user.id},
                process.env.JWT_SECRET || "your_jwt_secret_key",
                {expiresIn: "1d"} // Token expires in 1 day
            );

            return {
                token,
                user,
            };
        },
    },

    refreshToken: {
        type: AuthPayloadType,
        resolve: async (_, __, { req }) => {
            // Extraire le token de l'en-tête Authorization
            const authHeader = req.headers.authorization || '';
            console.log(`authHeader: ${authHeader}`);
            const token = authHeader.replace('Bearer ', '');
            console.log(`token: ${token}`);
            if (!token) {
                throw new Error('Token non fourni');
            }

            try {
                // Vérifier le token actuel
                const decoded = jwt.verify(token, process.env.JWT_SECRET);
                const user = await User.findById(decoded.userId);

                if (!user) {
                    throw new Error('Utilisateur non trouvé');
                }

                // Générer un nouveau token
                const newToken = jwt.sign(
                    {
                        userId: user._id,
                        email: user.email,
                        role: user.role,
                        username: user.username
                    },
                    process.env.JWT_SECRET,
                    { expiresIn: '7d' }
                );

                return {
                    token: newToken,
                    user
                };
            } catch (error) {
                throw new Error('Refresh token échoué');
            }
        }
    },


    /**
     * Mutation to update the authenticated user's information.
     * @returns {UserType} - Returns the updated user.
     */
    updateUser: {
        type: UserType,
        description: "Update the authenticated user's information",
        args: {
            username: {type: GraphQLString},
            password: {type: GraphQLString},
        },
        resolve: async (_, args, {user}) => {
            // Ensure the user is authenticated
            if (!user) throw new Error("Not authenticated");

            const updates = {};
            if (args.username) updates.username = args.username;
            if (args.password) {
                // Hash the new password before saving
                updates.password = await bcrypt.hash(args.password, 10);
            }

            // Update the user's information in the database
            return User.findByIdAndUpdate(
                user.id,
                updates,
                { new: true,}
            );
        },
    },

    /**
     * Mutation to delete the authenticated user's account.
     * @returns {Boolean} - Returns true if the user was successfully deleted.
     */
    deleteUser: {
        type: UserType,
        description: "Delete user account (can only delete own account)",
        args: {
            userId: { type: new GraphQLNonNull(GraphQLID) }
        },

        resolve: async (_, { userId }, { user }) => {
            // Vérification d'authentification
            if (!user) {
                throw new Error("Not authenticated");
            }

            // Vérifier que l'utilisateur ne peut supprimer que son propre compte
            if (user.id !== userId) {
                throw new Error("You can only delete your own account");
            }

            // Supprimer l'utilisateur de la base de données
            const deletedUser = await User.findByIdAndDelete(userId);

            if (!deletedUser) {
                throw new Error("User not found");
            }

            return deletedUser;
        }
    },
};

module.exports = mutations;
