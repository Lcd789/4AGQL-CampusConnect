const {
    GraphQLNonNull,
    GraphQLString,
    GraphQLID,
    GraphQLBoolean,
} = require("graphql");
const Class = require("../models/Class");
const Enrollment = require("../models/Enrollment");
const { ClassType, EnrollmentType } = require("./types");

const mutations = {
    createClass: {
        type: ClassType,
        args: {
            name: { type: new GraphQLNonNull(GraphQLString) },
            description: { type: GraphQLString },
            courseId: { type: new GraphQLNonNull(GraphQLID) },
        },
        resolve: async (_, { name, description, courseId }, { user }) => {
            if (!user || user.role !== "professor") {
                throw new Error("Not authorized");
            }

            // Vérifier si le cours existe via le service des notes
            // Ce serait une implémentation réelle, mais pour simplifier, nous allons juste créer la classe

            const newClass = new Class({
                name,
                description,
                professorId: user.id,
                courseId,
            });

            return newClass.save();
        },
    },
    updateClass: {
        type: ClassType,
        args: {
            id: { type: new GraphQLNonNull(GraphQLID) },
            name: { type: GraphQLString },
            description: { type: GraphQLString },
        },
        resolve: async (_, { id, name, description }, { user }) => {
            if (!user || user.role !== "professor") {
                throw new Error("Not authorized");
            }

            const classObj = await Class.findById(id);
            if (!classObj) throw new Error("Class not found");

            // Vérifier si le professeur est propriétaire de la classe
            if (classObj.professorId.toString() !== user.id) {
                throw new Error("Not authorized to update this class");
            }

            const updates = {};
            if (name) updates.name = name;
            if (description !== undefined) updates.description = description;

            return Class.findByIdAndUpdate(id, updates, { new: true });
        },
    },
    deleteClass: {
        type: GraphQLBoolean,
        args: {
            id: { type: new GraphQLNonNull(GraphQLID) },
        },
        resolve: async (_, { id }, { user }) => {
            if (!user || user.role !== "professor") {
                throw new Error("Not authorized");
            }

            const classObj = await Class.findById(id);
            if (!classObj) throw new Error("Class not found");

            // Vérifier si le professeur est propriétaire de la classe
            if (classObj.professorId.toString() !== user.id) {
                throw new Error("Not authorized to delete this class");
            }

            // Vérifier s'il y a des étudiants inscrits
            const enrollments = await Enrollment.find({ classId: id });
            if (enrollments.length > 0) {
                throw new Error("Cannot delete class with enrolled students");
            }

            await Class.findByIdAndDelete(id);
            return true;
        },
    },
    enrollStudent: {
        type: EnrollmentType,
        args: {
            classId: { type: new GraphQLNonNull(GraphQLID) },
            studentId: { type: new GraphQLNonNull(GraphQLID) },
        },
        resolve: async (_, { classId, studentId }, { user }) => {
            if (!user || user.role !== "professor") {
                throw new Error("Not authorized");
            }

            const classObj = await Class.findById(classId);
            if (!classObj) throw new Error("Class not found");

            // Vérifier si le professeur est propriétaire de la classe
            if (classObj.professorId.toString() !== user.id) {
                throw new Error(
                    "Not authorized to enroll students in this class"
                );
            }

            // Vérifier si l'étudiant est déjà inscrit
            const existingEnrollment = await Enrollment.findOne({
                classId,
                studentId,
            });
            if (existingEnrollment)
                throw new Error("Student already enrolled in this class");

            const enrollment = new Enrollment({
                classId,
                studentId,
            });

            return enrollment.save();
        },
    },
    removeStudentFromClass: {
        type: GraphQLBoolean,
        args: {
            classId: { type: new GraphQLNonNull(GraphQLID) },
            studentId: { type: new GraphQLNonNull(GraphQLID) },
        },
        resolve: async (_, { classId, studentId }, { user }) => {
            if (!user || user.role !== "professor") {
                throw new Error("Not authorized");
            }

            const classObj = await Class.findById(classId);
            if (!classObj) throw new Error("Class not found");

            // Vérifier si le professeur est propriétaire de la classe
            if (classObj.professorId.toString() !== user.id) {
                throw new Error(
                    "Not authorized to remove students from this class"
                );
            }

            await Enrollment.findOneAndDelete({ classId, studentId });
            return true;
        },
    },
};

module.exports = mutations;
