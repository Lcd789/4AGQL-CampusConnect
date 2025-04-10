/**
 * GraphQL type definitions for the Grade Service
 * Contains types for grades, courses, and related data structures
 */
const {
    GraphQLObjectType,
    GraphQLString,
    GraphQLID,
    GraphQLInt,
    GraphQLFloat,
    GraphQLList,
    GraphQLInputObjectType,
    GraphQLNonNull
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
 * Type representing a course in the system
 * Contains course details and resolvers for related data
 */
const CourseType = new GraphQLObjectType({
    name: 'Course',
    fields: () => ({
        id: { type: GraphQLID },
        title: { type: GraphQLString },
        description: { type: GraphQLString },
        professorId: { type: GraphQLID },
        createdAt: { type: GraphQLString },

        /**
         * Resolves the professor information by fetching from user-service
         * @returns {Promise<Object>} User data for the professor
         */
        professor: {
            type: UserType,
            resolve: async (parent, _, context) => {
                // Implementation...
            }
        },

        /**
         * Resolves all grades associated with this course
         * Filtered based on user role and permissions
         * @returns {Promise<Array>} List of grade objects
         */
        grades: {
            type: new GraphQLList(GradeType),
            resolve: async (parent, _, context) => {
                // Implementation...
            }
        }
    })
});

/**
 * Type representing a grade assigned to a student
 * Links a student to a course/class with grade value and comments
 */
const GradeType = new GraphQLObjectType({
    name: 'Grade',
    fields: () => ({
        id: { type: GraphQLID },
        studentId: { type: GraphQLID },
        courseId: { type: GraphQLID },
        classId: { type: GraphQLID },
        value: { type: GraphQLFloat },
        comment: { type: GraphQLString },
        createdBy: { type: GraphQLID },
        createdAt: { type: GraphQLString },

        /**
         * Resolves the student information by fetching from user-service
         * @returns {Promise<Object>} User data for the student
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
 * Input type for creating a new grade
 * Contains all required fields for grade creation
 */
const GradeInputType = new GraphQLInputObjectType({
    name: 'GradeInput',
    fields: {
        studentId: { type: new GraphQLNonNull(GraphQLID) },
        courseId: { type: new GraphQLNonNull(GraphQLID) },
        classId: { type: GraphQLID },
        value: { type: new GraphQLNonNull(GraphQLFloat) },
        comment: { type: GraphQLString }
    }
});

/**
 * Input type for updating an existing grade
 * Contains fields that can be modified on a grade
 */
const GradeUpdateInputType = new GraphQLInputObjectType({
    name: 'GradeUpdateInput',
    fields: {
        value: { type: GraphQLFloat },
        comment: { type: GraphQLString }
    }
});

/**
 * Type for representing statistical information about grades in a course
 * Includes metrics like median, average, highest and lowest grades
 */
const GradeStatsType = new GraphQLObjectType({
    name: 'GradeStats',
    fields: {
        courseId: { type: GraphQLID },
        median: { type: GraphQLFloat },
        lowest: { type: GraphQLFloat },
        highest: { type: GraphQLFloat },
        average: { type: GraphQLFloat },
        numberOfGrades: { type: GraphQLInt }
    }
});

module.exports = {
    UserType,
    CourseType,
    GradeType,
    GradeInputType,
    GradeUpdateInputType,
    GradeStatsType
};