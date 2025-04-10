/**
 * GraphQL type definitions for the Class Service
 * Contains types for User, Enrollment, Class, and related input types
 */
const {
    GraphQLObjectType,
    GraphQLString,
    GraphQLID,
    GraphQLList,
    GraphQLInputObjectType,
    GraphQLNonNull,
    GraphQLInt,
    GraphQLFloat
} = require('graphql');

/**
 * Reference type for User information
 * Simplified representation of a user from user-service
 */
const UserType = new GraphQLObjectType({
    name: 'User',
    fields: () => ({
        id: { type: GraphQLID },
        email: { type: GraphQLString },
        username: { type: GraphQLString },
        role: { type: GraphQLString }
    })
});

/**
 * Type representing a student's enrollment in a class
 * Links a student to a class with enrollment date information
 */
const EnrollmentType = new GraphQLObjectType({
    name: 'Enrollment',
    fields: () => ({
        id: { type: GraphQLID },
        classId: { type: GraphQLID },
        studentId: { type: GraphQLID },
        enrolledAt: { type: GraphQLString },
        /**
         * Resolves the full user data for an enrolled student by fetching from user-service
         * @returns {Promise<Object>} User data with id, email, username and role
         */
        student: {
            type: UserType,
            resolve: async (parent, _, context) => {
                // Implementation...
            }
        }
    })
});

/**
 * Input type for creating or updating a class
 * Contains all fields necessary for class creation/modification
 */
const ClassInputType = new GraphQLInputObjectType({
    name: 'ClassInput',
    fields: {
        title: { type: new GraphQLNonNull(GraphQLString) },
        description: { type: GraphQLString },
        start: { type: new GraphQLNonNull(GraphQLString) },
        end: { type: new GraphQLNonNull(GraphQLString) },
        room: { type: GraphQLString },
        color: { type: GraphQLString }
    }
});

/**
 * Type for representing statistical information about grades in a class
 * Includes metrics like median, average, highest and lowest grades
 */
const ClassGradeStatsType = new GraphQLObjectType({
    name: 'ClassGradeStats',
    fields: {
        classId: { type: GraphQLID },
        courseId: { type: GraphQLID },
        median: { type: GraphQLFloat },
        lowest: { type: GraphQLFloat },
        highest: { type: GraphQLFloat },
        average: { type: GraphQLFloat },
        numberOfGrades: { type: GraphQLInt }
    }
});

/**
 * Main type representing a class in the system
 * Contains all class details and resolvers for related data
 */
const ClassType = new GraphQLObjectType({
    name: 'Class',
    fields: () => ({
        id: {
            type: GraphQLID,
            resolve: parent => parent._id ||parent.id
        },
        title: {
            type: GraphQLString,
            resolve: parent => parent.name
        },
        description: { type: GraphQLString },
        start: {
            type: GraphQLString,
            resolve: parent => parent.startDate
                ? parent.startDate.toISOString()
                : null
        },
        end: {
            type: GraphQLString,
            resolve: parent => parent.endDate
                ? parent.endDate.toISOString()
                : null
        },
        room: { type: GraphQLString },
        color: { type: GraphQLString },
        professorId: {
            type: GraphQLID,
            resolve: parent => parent.professor
        },
        courseId: { type: GraphQLID },
        createdAt: { type: GraphQLString },
    })
});

module.exports = {
    UserType,
    EnrollmentType,
    ClassInputType,
    ClassGradeStatsType,
    ClassType
};