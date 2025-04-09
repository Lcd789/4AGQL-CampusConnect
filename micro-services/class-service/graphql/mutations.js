const {
    GraphQLNonNull,
    GraphQLString,
    GraphQLID,
    GraphQLBoolean,
} = require("graphql");
const Class = require("../models/Class");
const Enrollment = require("../models/Enrollment");
const { ClassType, EnrollmentType, ClassInputType} = require("./types");

const mutations = {
    createClass: {
        type: ClassType,
        args: {
            input: { type: new GraphQLNonNull(ClassInputType) },
        },
        resolve: async (_, { input }, { user }) => {
            // Vérification que l'utilisateur est authentifié et est un professeur
            if (!user || user.role !== "professor") {
                throw new Error("Not authorized");
            }

            try {
                // Création de la nouvelle classe
                const newClass = new Class({
                    title: input.title,
                    description: input.description,
                    start: input.start,
                    end: input.end,
                    room: input.room,
                    color: input.color || "#4A90E2", // Couleur par défaut si non spécifiée
                    professorId: user.id,
                    courseId: input.courseId
                });

                // Sauvegarde dans la base de données
                return await newClass.save();
            } catch (error) {
                console.error("Error creating class:", error);
                throw new Error("Failed to create class");
            }
        }
    },

    updateClass: {
        type: ClassType,
        args: {
            id: { type: new GraphQLNonNull(GraphQLID) },
            input: { type: new GraphQLNonNull(ClassInputType) },
        },
        resolve: async (_, { id, input }, { user }) => {
            if (!user || user.role !== "professor") {
                throw new Error("Not authorized");
            }

            const classObj = await Class.findById(id);
            if (!classObj) throw new Error("Class not found");

            if (classObj.professorId.toString() !== user.id) {
                throw new Error("Not authorized to update this class");
            }

            return Class.findByIdAndUpdate(
                id,
                {
                    title: input.title,
                    description: input.description,
                    start: input.start,
                    end: input.end,
                    room: input.room,
                    color: input.color
                },
                { new: true }
            );
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

            if (classObj.professorId.toString() !== user.id) {
                throw new Error("Not authorized to delete this class");
            }

            const enrollments = await Enrollment.find({
                classId: id
            })
            if(enrollments.length > 0) {
                throw new Error("Cannot delete class with enrolled students. Please remove students first.");
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
