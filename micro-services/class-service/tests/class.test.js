const { ApolloServer } = require('@apollo/server');
const { startStandaloneServer } = require('@apollo/server/standalone');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const { typeDefs } = require('../graphql/schema');
const { queries } = require('../graphql/queries');
const { mutations } = require('../graphql/mutations');
const Class = require('../models/Class');
const Enrollment = require('../models/Enrollment');
const { JWT_SECRET } = process.env;

// Mock pour mongoose
jest.mock('mongoose');
jest.mock('../models/Class');
jest.mock('../models/Enrollment');

describe('Class Service Tests', () => {
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

    // TEST 1: CREATE CLASS
    test('createClass mutation should create a new class', async () => {
        const mockClass = {
            id: 'class123',
            name: 'Mathematics 101',
            description: 'Introduction to Mathematics',
            startDate: new Date('2023-09-01'),
            endDate: new Date('2023-12-15'),
            room: 'A101',
            color: '#4A90E2',
            professor: 'prof123',
            courses: ['course123']
        };

        // Configure mocks
        Class.prototype.save = jest.fn().mockResolvedValue(mockClass);

        // Execute the mutation with professor context
        const result = await server.executeOperation({
            query: `
        mutation {
          createClass(input: {
            title: "Mathematics 101",
            description: "Introduction to Mathematics",
            start: "2023-09-01",
            end: "2023-12-15",
            room: "A101",
            color: "#4A90E2",
            courseId: "course123"
          }) {
            id
            name
            description
          }
        }
      `,
        }, {
            contextValue: {
                user: { id: 'prof123', role: 'professor' }
            }
        });

        // Assert the results
        expect(result.body.singleResult.errors).toBeUndefined();
        expect(result.body.singleResult.data.createClass).toEqual({
            id: 'class123',
            name: 'Mathematics 101',
            description: 'Introduction to Mathematics'
        });
    });

    // TEST 2: GET CLASS BY ID
    test('getClass query should return a class by ID', async () => {
        const mockClass = {
            id: 'class123',
            name: 'Mathematics 101',
            description: 'Introduction to Mathematics',
            startDate: new Date('2023-09-01'),
            endDate: new Date('2023-12-15'),
            room: 'A101',
            color: '#4A90E2',
            professor: 'prof123',
            courses: ['course123']
        };

        // Configure mocks
        Class.findById = jest.fn().mockReturnValue({
            populate: jest.fn().mockReturnValue({
                populate: jest.fn().mockResolvedValue(mockClass)
            })
        });

        // Execute the query
        const result = await server.executeOperation({
            query: `
        query {
          getClass(id: "class123") {
            id
            name
            description
          }
        }
      `,
        });

        // Assert the results
        expect(result.body.singleResult.errors).toBeUndefined();
        expect(result.body.singleResult.data.getClass).toEqual({
            id: 'class123',
            name: 'Mathematics 101',
            description: 'Introduction to Mathematics'
        });
    });

    // TEST 3: GET ALL CLASSES
    test('getClasses query should return all classes', async () => {
        const mockClasses = [
            {
                id: 'class123',
                name: 'Mathematics 101',
                description: 'Introduction to Mathematics'
            },
            {
                id: 'class456',
                name: 'Physics 101',
                description: 'Introduction to Physics'
            }
        ];

        // Configure mocks
        Class.find = jest.fn().mockReturnValue({
            populate: jest.fn().mockReturnValue({
                populate: jest.fn().mockResolvedValue(mockClasses)
            })
        });

        // Execute the query
        const result = await server.executeOperation({
            query: `
        query {
          getClasses {
            id
            name
            description
          }
        }
      `,
        });

        // Assert the results
        expect(result.body.singleResult.errors).toBeUndefined();
        expect(result.body.singleResult.data.getClasses).toEqual(mockClasses);
    });

    // TEST 4: ENROLL STUDENT
    test('enrollStudent mutation should enroll a student in a class', async () => {
        const mockClass = {
            id: 'class123',
            name: 'Mathematics 101'
        };

        const mockEnrollment = {
            id: 'enrollment123',
            class: 'class123',
            student: 'student123',
            enrollmentDate: new Date('2023-08-15')
        };

        // Configure mocks
        Class.findById = jest.fn().mockResolvedValue(mockClass);
        Enrollment.findOne = jest.fn().mockResolvedValue(null); // Student not already enrolled
        Enrollment.prototype.save = jest.fn().mockResolvedValue(mockEnrollment);

        // Execute the mutation with professor context
        const result = await server.executeOperation({
            query: `
        mutation {
          enrollStudent(
            classId: "class123",
            studentId: "student123"
          ) {
            id
            enrollmentDate
          }
        }
      `,
        }, {
            contextValue: {
                user: { id: 'prof123', role: 'professor' }
            }
        });

        // Assert the results
        expect(result.body.singleResult.errors).toBeUndefined();
        expect(result.body.singleResult.data.enrollStudent).toEqual({
            id: 'enrollment123',
            enrollmentDate: mockEnrollment.enrollmentDate.toISOString()
        });
    });

    // TEST 5: DELETE CLASS
    test('deleteClass mutation should delete a class', async () => {
        const mockClass = {
            id: 'class123',
            professor: 'prof123'
        };

        // Configure mocks
        Class.findById = jest.fn().mockResolvedValue(mockClass);
        Enrollment.find = jest.fn().mockResolvedValue([]); // No enrollments
        Class.findByIdAndDelete = jest.fn().mockResolvedValue(mockClass);

        // Execute the mutation with professor context
        const result = await server.executeOperation({
            query: `
        mutation {
          deleteClass(id: "class123") {
            success
            message
          }
        }
      `,
        }, {
            contextValue: {
                user: { id: 'prof123', role: 'professor' }
            }
        });

        // Assert the results
        expect(result.body.singleResult.errors).toBeUndefined();
        expect(result.body.singleResult.data.deleteClass).toEqual({
            success: true,
            message: 'Class deleted successfully.'
        });
    });
});