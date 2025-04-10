const { ApolloServer } = require('@apollo/server');
const { startStandaloneServer } = require('@apollo/server/standalone');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const { typeDefs } = require('../graphql/schema');
const { queries } = require('../graphql/queries');
const { mutations } = require('../graphql/mutations');
const Grade = require('../models/Grade');
const Course = require('../models/Course');
const { JWT_SECRET } = process.env;

// Mock pour mongoose
jest.mock('mongoose');
jest.mock('../models/Grade');
jest.mock('../models/Course');

describe('Grade Service Tests', () => {
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

    // TEST 1: CREATE GRADE
    test('createGrade mutation should create a new grade for a student', async () => {
        const mockGrade = {
            id: 'grade123',
            student: 'student123',
            course: 'course123',
            value: 85,
            comment: 'Good work',
            date: new Date('2023-10-15')
        };

        // Configure mocks
        Course.findById = jest.fn().mockResolvedValue({ id: 'course123', name: 'Mathematics' });
        Grade.prototype.save = jest.fn().mockResolvedValue(mockGrade);

        // Execute the mutation with professor context
        const result = await server.executeOperation({
            query: `
        mutation {
          createGrade(
            studentId: "student123",
            courseId: "course123",
            value: 85,
            comment: "Good work"
          ) {
            id
            value
            comment
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
        expect(result.body.singleResult.data.createGrade).toEqual({
            id: 'grade123',
            value: 85,
            comment: 'Good work'
        });
    });

    // TEST 2: GET STUDENT GRADES
    test('getStudentGrades query should return all grades for a student', async () => {
        const mockGrades = [
            {
                id: 'grade123',
                student: 'student123',
                course: { id: 'course123', name: 'Mathematics' },
                value: 85,
                comment: 'Good work',
                date: new Date('2023-10-15')
            },
            {
                id: 'grade456',
                student: 'student123',
                course: { id: 'course456', name: 'Physics' },
                value: 90,
                comment: 'Excellent',
                date: new Date('2023-10-20')
            }
        ];

        // Configure mocks
        Grade.find = jest.fn().mockReturnValue({
            populate: jest.fn().mockResolvedValue(mockGrades)
        });

        // Execute the query with student context
        const result = await server.executeOperation({
            query: `
        query {
          getStudentGrades {
            id
            value
            comment
            course {
              id
              name
            }
          }
        }
      `,
        }, {
            contextValue: {
                user: { id: 'student123', role: 'student' }
            }
        });

        // Assert the results
        expect(result.body.singleResult.errors).toBeUndefined();
        expect(result.body.singleResult.data.getStudentGrades).toEqual(mockGrades.map(g => ({
            id: g.id,
            value: g.value,
            comment: g.comment,
            course: g.course
        })));
    });

    // TEST 3: GET GRADES BY COURSE
    test('getGradesByCourse query should return all grades for a course', async () => {
        const mockGrades = [
            {
                id: 'grade123',
                student: { id: 'student123', username: 'student1' },
                course: { id: 'course123', name: 'Mathematics' },
                value: 85,
                comment: 'Good work',
                date: new Date('2023-10-15')
            },
            {
                id: 'grade789',
                student: { id: 'student456', username: 'student2' },
                course: { id: 'course123', name: 'Mathematics' },
                value: 78,
                comment: 'Needs improvement',
                date: new Date('2023-10-15')
            }
        ];

        // Configure mocks
        Grade.find = jest.fn().mockReturnValue({
            populate: jest.fn().mockReturnValue({
                populate: jest.fn().mockResolvedValue(mockGrades)
            })
        });
        Course.findById = jest.fn().mockResolvedValue({ id: 'course123', name: 'Mathematics' });

        // Execute the query with professor context
        const result = await server.executeOperation({
            query: `
        query {
          getGradesByCourse(courseId: "course123") {
            id
            value
            student {
              id
              username
            }
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
        expect(result.body.singleResult.data.getGradesByCourse).toEqual(mockGrades.map(g => ({
            id: g.id,
            value: g.value,
            student: g.student
        })));
    });

    // TEST 4: UPDATE GRADE
    test('updateGrade mutation should update an existing grade', async () => {
        const mockGrade = {
            id: 'grade123',
            student: 'student123',
            course: 'course123',
            value: 85,
            comment: 'Good work',
            date: new Date('2023-10-15'),
            professor: 'prof123'
        };

        const updatedMockGrade = {
            ...mockGrade,
            value: 90,
            comment: 'Excellent work after revision'
        };

        // Configure mocks
        Grade.findById = jest.fn().mockResolvedValue(mockGrade);
        Grade.findByIdAndUpdate = jest.fn().mockResolvedValue(updatedMockGrade);

        // Execute the mutation with professor context
        const result = await server.executeOperation({
            query: `
        mutation {
          updateGrade(
            id: "grade123",
            value: 90,
            comment: "Excellent work after revision"
          ) {
            id
            value
            comment
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
        expect(result.body.singleResult.data.updateGrade).toEqual({
            id: 'grade123',
            value: 90,
            comment: 'Excellent work after revision'
        });
    });

    // TEST 5: DELETE GRADE
    test('deleteGrade mutation should delete a grade', async () => {
        const mockGrade = {
            id: 'grade123',
            professor: 'prof123'
        };

        // Configure mocks
        Grade.findById = jest.fn().mockResolvedValue(mockGrade);
        Grade.findByIdAndDelete = jest.fn().mockResolvedValue(mockGrade);

        // Execute the mutation with professor context
        const result = await server.executeOperation({
            query: `
        mutation {
          deleteGrade(id: "grade123") {
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
        expect(result.body.singleResult.data.deleteGrade).toEqual({
            success: true,
            message: 'Grade deleted successfully'
        });
    });

    // TEST 6: GET GRADE STATISTICS
    test('getGradeStatistics query should return statistics for a course', async () => {
        const mockGrades = [
            { value: 85 },
            { value: 90 },
            { value: 75 },
            { value: 80 }
        ];

        // Configure mocks
        Grade.find = jest.fn().mockResolvedValue(mockGrades);
        Course.findById = jest.fn().mockResolvedValue({ id: 'course123', name: 'Mathematics' });

        // Execute the query with professor context
        const result = await server.executeOperation({
            query: `
        query {
          getGradeStatistics(courseId: "course123") {
            average
            median
            min
            max
            count
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
        expect(result.body.singleResult.data.getGradeStatistics).toEqual({
            average: 82.5,
            median: 82.5,
            min: 75,
            max: 90,
            count: 4
        });
    });
});