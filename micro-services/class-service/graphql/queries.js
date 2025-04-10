/**
 * GraphQL queries for the Class Service
 * Provides access to classes, enrollments, and related data
 */
const {
    GraphQLList,
    GraphQLID,
    GraphQLNonNull,
    GraphQLString
} = require('graphql');
const Class = require('../models/Class');
const Enrollment = require('../models/Enrollment');
const { ClassType, EnrollmentType } = require('./types');

const queries = {
    /**
     * Retrieves all classes in the system
     * Supports sorting by different fields and order directions
     * Accessible to all authenticated users
     *
     * @param {Object} _ - Parent resolver (not used)
     * @param {Object} args - Query arguments
     * @param {string} args.sortBy - Field to sort results by (default: 'title')
     * @param {string} args.order - Order direction ('asc' or 'desc', default: 'asc')
     * @returns {Promise<Array>} List of class objects
     */
    classes: {
        type: new GraphQLList(ClassType),
        args: {
            sortBy: { type: GraphQLString, defaultValue: 'title' },
            order: { type: GraphQLString, defaultValue: 'asc' }
        },
        resolve: async (_, { sortBy, order }) => {
            const sortOptions = {};
            sortOptions[sortBy] = order === 'desc' ? -1 : 1;

            return await Class.find().sort(sortOptions);
        }
    },

    /**
     * Retrieves a specific class by its ID
     *
     * @param {Object} _ - Parent resolver (not used)
     * @param {Object} args - Query arguments
     * @param {ID} args.id - ID of the class to retrieve
     * @returns {Promise<Object>} The requested class object
     */
    class: {
        type: ClassType,
        args: {
            id: { type: new GraphQLNonNull(GraphQLID) }
        },
        resolve: async (_, { id }) => {
            return await Class.findById(id);
        }
    },

    /**
     * Retrieves all classes taught by a specific professor
     *
     * @param {Object} _ - Parent resolver (not used)
     * @param {Object} args - Query arguments
     * @param {ID} args.professorId - ID of the professor
     * @returns {Promise<Array>} List of classes taught by the specified professor
     */
    classesByProfessorId: {
        type: new GraphQLList(ClassType),
        args: {
            professorId: { type: new GraphQLNonNull(GraphQLID) }
        },
        resolve: async (_, { professorId }, context) => {
            return await Class.find({ professorId });
        }
    },

    /**
     * Retrieves all classes relevant to the authenticated user
     * For professors: returns classes they teach
     * For students: returns classes they're enrolled in
     *
     * @param {Object} _ - Parent resolver (not used)
     * @param {Object} __ - Arguments (not used)
     * @param {Object} context - Request context containing authenticated user
     * @returns {Promise<Array>} List of classes
     * @throws {Error} If user is not authenticated
     */
    myClasses: {
        type: new GraphQLList(ClassType),
        resolve: async (_, __, context) => {
            if (!context.user) {
                throw new Error('Non authentifié');
            }

            if (context.user.role === 'professor') {
                return await Class.find({ professorId: context.user.id });
            } else if (context.user.role === 'student') {
                // Pour un étudiant, trouver toutes ses inscriptions puis les classes correspondantes
                const enrollments = await Enrollment.find({ studentId: context.user.id });
                const classIds = enrollments.map(e => e.classId);
                return await Class.find({ _id: { $in: classIds } });
            }

            return [];
        }
    },

    /**
     * Retrieves all enrollments for a specific class
     * Restricted based on user role and permissions
     *
     * @param {Object} _ - Parent resolver (not used)
     * @param {Object} args - Query arguments
     * @param {ID} args.classId - ID of the class to get enrollments for
     * @param {Object} context - Request context containing authenticated user
     * @returns {Promise<Array>} List of enrollment objects
     * @throws {Error} If user is not authenticated or lacks permissions
     */
    classEnrollments: {
        type: new GraphQLList(EnrollmentType),
        args: {
            classId: { type: new GraphQLNonNull(GraphQLID) }
        },
        resolve: async (_, { classId }, context) => {
            // Implementation...
        }
    },

    /**
     * Retrieves all classes that a specific student is enrolled in
     *
     * @param {Object} _ - Parent resolver (not used)
     * @param {Object} args - Query arguments
     * @param {ID} args.studentId - ID of the student
     * @returns {Promise<Array>} List of classes the student is enrolled in
     */
    studentClasses: {
        type: new GraphQLList(ClassType),
        args: {
            studentId: { type: new GraphQLNonNull(GraphQLID) }
        },
        resolve: async (_, { studentId }, context) => {
            // Implementation...
        }
    }
};

module.exports = queries;