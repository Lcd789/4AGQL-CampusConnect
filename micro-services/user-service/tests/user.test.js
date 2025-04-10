const { ApolloServer } = require('@apollo/server');
const { startStandaloneServer } = require('@apollo/server/standalone');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { typeDefs } = require('../graphql/schema');
const { queries } = require('../graphql/queries');
const { mutations } = require('../graphql/mutations');
const User = require('../models/User');
const { JWT_SECRET } = process.env;

// Mock pour mongoose
jest.mock('mongoose');
jest.mock('../models/User');

describe('User Service Tests', () => {
    let server;
    let url;

    beforeAll(async () => {
        // Créer un serveur Apollo avec les resolvers et typeDefs
        const resolvers = {
            Query: queries,
            Mutation: mutations
        };

        server = new ApolloServer({
            typeDefs,
            resolvers,
        });

        ({ url } = await startStandaloneServer(server, {
            context: async ({ req }) => {
                // Mock d'authentification pour les tests
                const token = req.headers.authorization?.split(' ')[1] || '';
                if (token) {
                    try {
                        const decoded = jwt.verify(token, JWT_SECRET || 'test-secret');
                        return { user: decoded };
                    } catch (err) {
                        return { user: null };
                    }
                }
                return { user: null };
            },
        }));
    });

    afterAll(async () => {
        await server.stop();
        await mongoose.disconnect();
    });

    beforeEach(() => {
        // Reset all mocks before each test
        jest.clearAllMocks();
    });

    // TEST 1: REGISTER USER
    test('registerUser mutation should create a new user', async () => {
        const mockUser = {
            id: 'user123',
            username: 'testuser',
            email: 'test@example.com',
            password: 'hashedpassword123',
            role: 'student'
        };

        // Configure mocks
        bcrypt.hash = jest.fn().mockResolvedValue('hashedpassword123');
        User.findOne = jest.fn().mockResolvedValue(null); // User doesn't exist
        User.prototype.save = jest.fn().mockResolvedValue(mockUser);

        // Execute the mutation
        const result = await server.executeOperation({
            query: `
        mutation {
          registerUser(username: "testuser", email: "test@example.com", password: "password123", role: "student") {
            id
            username
            email
            role
          }
        }
      `,
        });

        // Assert the results
        expect(result.body.singleResult.errors).toBeUndefined();
        expect(result.body.singleResult.data.registerUser).toEqual({
            id: 'user123',
            username: 'testuser',
            email: 'test@example.com',
            role: 'student'
        });
    });

    // TEST 2: LOGIN USER
    test('loginUser mutation should return a token for valid credentials', async () => {
        const mockUser = {
            id: 'user123',
            username: 'testuser',
            email: 'test@example.com',
            password: 'hashedpassword123',
            role: 'student'
        };

        // Configure mocks
        User.findOne = jest.fn().mockResolvedValue(mockUser);
        bcrypt.compare = jest.fn().mockResolvedValue(true);
        jwt.sign = jest.fn().mockReturnValue('token123');

        // Execute the mutation
        const result = await server.executeOperation({
            query: `
        mutation {
          loginUser(email: "test@example.com", password: "password123") {
            token
            user {
              id
              username
              email
              role
            }
          }
        }
      `,
        });

        // Assert the results
        expect(result.body.singleResult.errors).toBeUndefined();
        expect(result.body.singleResult.data.loginUser).toEqual({
            token: 'token123',
            user: {
                id: 'user123',
                username: 'testuser',
                email: 'test@example.com',
                role: 'student'
            }
        });
    });

    // TEST 3: GET USER BY ID
    test('getUser query should return a user by ID', async () => {
        const mockUser = {
            id: 'user123',
            username: 'testuser',
            email: 'test@example.com',
            role: 'student'
        };

        // Configure mocks
        User.findById = jest.fn().mockResolvedValue(mockUser);

        // Execute the query
        const result = await server.executeOperation({
            query: `
        query {
          getUser(id: "user123") {
            id
            username
            email
            role
          }
        }
      `,
        });

        // Assert the results
        expect(result.body.singleResult.errors).toBeUndefined();
        expect(result.body.singleResult.data.getUser).toEqual(mockUser);
    });

    // TEST 4: GET ALL USERS
    test('getUsers query should return all users', async () => {
        const mockUsers = [
            {
                id: 'user123',
                username: 'testuser1',
                email: 'test1@example.com',
                role: 'student'
            },
            {
                id: 'user456',
                username: 'testuser2',
                email: 'test2@example.com',
                role: 'professor'
            }
        ];

        // Configure mocks
        User.find = jest.fn().mockResolvedValue(mockUsers);

        // Execute the query
        const result = await server.executeOperation({
            query: `
        query {
          getUsers {
            id
            username
            email
            role
          }
        }
      `,
        });

        // Assert the results
        expect(result.body.singleResult.errors).toBeUndefined();
        expect(result.body.singleResult.data.getUsers).toEqual(mockUsers);
    });
});