/**
 * GraphQL queries for the Grade Service
 * Provides access to grades, course data, and grade statistics
 */
const {
    GraphQLObjectType,
    GraphQLID,
    GraphQLList,
    GraphQLString,
    GraphQLNonNull
} = require('graphql');
const { GradeType, GradeStatsType, CourseType } = require('./types');
const Grade = require('../models/Grade');

const queries = new GraphQLObjectType({
    name: 'Query',
    fields: {
        /**
         * Retrieves a specific grade by its ID
         * Access restricted based on user role and ownership
         *
         * @param {Object} _ - Parent resolver (not used)
         * @param {Object} args - Query arguments
         * @param {ID} args.id - ID of the grade to retrieve
         * @param {Object} context - Request context containing authenticated user
         * @returns {Promise<Object>} The requested grade object
         * @throws {Error} If user is not authenticated or lacks permissions
         */
        grade: {
            type: GradeType,
            args: {
                id: { type: new GraphQLNonNull(GraphQLID) }
            },
            resolve: async (_, { id }, context) => {
                // Implementation...
                if(!user){
                    throw new Error('Unauthorized');
                }

                const grade = await Grade.findById(id)
                    .populate('student')
                    .populate('course')
                    .populate('class');

                if(!grade){
                    throw new Error(`Grade of ID ${id} not found`);
                }

                if(user.role === 'student'){
                    // a student can only see his own grades
                    if(grade.student.id !== user.id){
                        throw new Error('Unauthorized, you cannot view this grade');
                    }
                } else if(user.role === 'professor'){
                    const classItem = await Class.findById(grade.classId);
                    if(!classItem){
                        throw new Error(`Class of ID ${grade.classId} not found`);
                    }
                    if(classItem.professorId !== user.id){
                        throw new Error('Unauthorized, you cannot view this grade');
                    }
                }
                return grade;
            }
        },

        /**
         * Retrieves all grades for a specific student
         * Can be filtered by courseId
         *
         * @param {Object} _ - Parent resolver (not used)
         * @param {Object} args - Query arguments
         * @param {ID} args.studentId - ID of the student
         * @param {ID} [args.courseId] - Optional course ID to filter by
         * @param {Object} context - Request context containing authenticated user
         * @returns {Promise<Array>} List of grade objects
         * @throws {Error} If user is not authenticated or lacks permissions
         */
        studentGrades: {
            type: new GraphQLList(GradeType),
            args: {
                studentId: { type: new GraphQLNonNull(GraphQLID) },
                courseId: { type: GraphQLID }
            },
            resolve: async (_, { studentId, classId }, {user}) => {
                if(!user){
                    throw new Error('Unauthorized');
                }

                if(user.role === 'student'){
                    if (user.id.toString() !== studentId.toString()) {
                        throw new Error("Vous n'êtes pas autorisé à accéder aux notes de cet étudiant");
                    }

                } else if (user.role === 'professor') {
                    if(classId) {
                        const classItem = await Class.findById(classId);
                        if(!classItem){
                            throw new Error(`Class of ID ${classId} not found`);
                        }
                        if(classItem.professorId !== user.id){
                            throw new Error('Unauthorized, you cannot view this grade');
                        }
                    }
                }
            }
        },

        /**
         * Retrieves all grades for a specific course
         * For professors: returns all grades in the course
         * For students: returns only their own grades
         *
         * @param {Object} _ - Parent resolver (not used)
         * @param {Object} args - Query arguments
         * @param {ID} args.courseId - ID of the course
         * @param {Object} context - Request context containing authenticated user
         * @returns {Promise<Array>} List of grade objects
         * @throws {Error} If user is not authenticated
         */
        courseGrades: {
            type: new GraphQLList(GradeType),
            args: {
                courseId: { type: new GraphQLNonNull(GraphQLID) }
            },
            resolve: async (_, { courseId }, context) => {
                // Implementation...
            }
        },

        /**
         * Retrieves statistical information about grades in a course
         *
         * @param {Object} _ - Parent resolver (not used)
         * @param {Object} args - Query arguments
         * @param {ID} args.courseId - ID of the course
         * @param {Object} context - Request context containing authenticated user
         * @returns {Promise<Object>} Grade statistics object
         * @throws {Error} If user is not authenticated or lacks permissions
         */
        courseGradeStats: {
            type: GradeStatsType,
            args: {
                courseId: { type: new GraphQLNonNull(GraphQLID) }
            },
            resolve: async (_, { courseId }, context) => {
                // Implementation...
            }
        }
    }
});

module.exports = queries;