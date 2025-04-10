/**
 * GraphQL mutations for the Class Service
 * Provides operations for creating, updating, and managing classes and enrollments
 */
const {
    GraphQLNonNull,
    GraphQLString,
    GraphQLID,
    GraphQLBoolean
} = require('graphql');
const mongoose = require('mongoose');
const Class = require('../models/Class');
const Enrollment = require('../models/Enrollment');
const { ClassType, EnrollmentType, ClassInputType } = require('./types');

const mutations = {
    /**
     * Creates a new class in the system
     * Only professors can create classes
     *
     * @param {Object} _ - Parent resolver (not used)
     * @param {Object} args - Mutation arguments
     * @param {Object} args.input - Class input data (title, description, dates, etc.)
     * @param {Object} context - Request context containing authenticated user
     * @returns {Promise<Object>} The newly created class
     * @throws {Error} If user is not authenticated as a professor
     */
    createClass: {
        type: ClassType,
        description: 'Creates a new class',
        args: {
            input: { type: new GraphQLNonNull(ClassInputType) }
        },
        resolve: async (_, { input }, context) => {
            console.log('Creating class:', input);
            console.log('Context:', context);
            // Vérification de l'authentification et des droits
            if (!context.user || context.user.role !== 'professor') {
                throw new Error('You must be logged in as a professor to create a class.');
            }

            try {
                const newClass = new Class({
                    name: input.title,
                    description: input.description,
                    startDate: new Date(input.start),
                    endDate: new Date(input.end),
                    room: input.room,
                    color: input.color || '#4A90E2',
                    professor: context.user.id,
                    courses: [input.courseId]
                });

                return await newClass.save();
            } catch (error) {
                console.error('Erreur lors de la création de la classe:', error);
                throw new Error('Impossible de créer la classe');
            }
        }
    },

    /**
     * Updates an existing class with new information
     * Only the professor who created the class can update it
     *
     * @param {Object} _ - Parent resolver (not used)
     * @param {Object} args - Mutation arguments
     * @param {ID} args.id - ID of the class to update
     * @param {Object} args.input - New class data
     * @param {Object} context - Request context containing authenticated user
     * @returns {Promise<Object>} The updated class
     * @throws {Error} If user lacks permissions or class doesn't exist
     */
    updateClass: {
        type: ClassType,
        description: 'Updates an existing class',
        args: {
            id: { type: new GraphQLNonNull(GraphQLID) },
            input: { type: new GraphQLNonNull(ClassInputType) }
        },
        resolve: async (_, { id, input }, context) => {
            // Implementation...
        }
    },

    /**
     * Deletes a class from the system
     * Only the professor who created the class can delete it
     *
     * @param {Object} _ - Parent resolver (not used)
     * @param {Object} args - Mutation arguments
     * @param {ID} args.id - ID of the class to delete
     * @param {Object} context - Request context containing authenticated user
     * @returns {Promise<Boolean>} True if successfully deleted
     * @throws {Error} If user lacks permissions or class doesn't exist
     */
    deleteClass: {
        type: GraphQLBoolean,
        description: 'Deletes a class',
        args: {
            id: { type: new GraphQLNonNull(GraphQLID) }
        },
        resolve: async (_, { id }, context) => {
            // Implementation...
        }
    }
};

module.exports = mutations;