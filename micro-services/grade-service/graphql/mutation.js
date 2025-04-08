const {
    GraphQLObjectType,
    GraphQLID,
    GraphQLString,
    GraphQLFloat,
    GraphQLBoolean,
    GraphQLNonNull,
} = require("graphql");
const { CourseType, GradeType } = require("./types");
const Course = require("../models/Course");
const Grade = require("../models/Grade");

const mutations = new GraphQLObjectType({
    name: "Mutation",
    fields: {
        createCourse: {
            type: CourseType,
            args: {
                name: { type: new GraphQLNonNull(GraphQLString) },
                description: { type: GraphQLString },
            },
            resolve: async (_, { name, description }, { user }) => {
                if (!user || user.role !== "professor") {
                    throw new Error("Not authorized");
                }

                const course = new Course({
                    name,
                    description,
                    professorId: user.id,
                });

                return course.save();
            },
        },
        updateCourse: {
            type: CourseType,
            args: {
                id: { type: new GraphQLNonNull(GraphQLID) },
                name: { type: GraphQLString },
                description: { type: GraphQLString },
            },
            resolve: async (_, { id, name, description }, { user }) => {
                if (!user || user.role !== "professor") {
                    throw new Error("Not authorized");
                }

                const course = await Course.findById(id);
                if (!course) throw new Error("Course not found");

                // Vérifier si le professeur est propriétaire du cours
                if (course.professorId.toString() !== user.id) {
                    throw new Error("Not authorized to update this course");
                }

                const updates = {};
                if (name) updates.name = name;
                if (description !== undefined)
                    updates.description = description;

                return Course.findByIdAndUpdate(id, updates, { new: true });
            },
        },
        deleteCourse: {
            type: GraphQLBoolean,
            args: {
                id: { type: new GraphQLNonNull(GraphQLID) },
            },
            resolve: async (_, { id }, { user }) => {
                if (!user || user.role !== "professor") {
                    throw new Error("Not authorized");
                }

                const course = await Course.findById(id);
                if (!course) throw new Error("Course not found");

                // Vérifier si le professeur est propriétaire du cours
                if (course.professorId.toString() !== user.id) {
                    throw new Error("Not authorized to delete this course");
                }

                // Vérifier s'il y a des notes associées
                const grades = await Grade.find({ courseId: id });
                if (grades.length > 0) {
                    throw new Error(
                        "Cannot delete course with associated grades"
                    );
                }

                await Course.findByIdAndDelete(id);
                return true;
            },
        },
        createGrade: {
            type: GradeType,
            args: {
                studentId: { type: new GraphQLNonNull(GraphQLID) },
                courseId: { type: new GraphQLNonNull(GraphQLID) },
                value: { type: new GraphQLNonNull(GraphQLFloat) },
                comment: { type: GraphQLString },
            },
            resolve: async (
                _,
                { studentId, courseId, value, comment },
                { user }
            ) => {
                if (!user || user.role !== "professor") {
                    throw new Error("Not authorized");
                }

                // Vérifier si le cours existe
                const course = await Course.findById(courseId);
                if (!course) throw new Error("Course not found");

                const grade = new Grade({
                    studentId,
                    courseId,
                    professorId: user.id,
                    value,
                    comment,
                });

                return grade.save();
            },
        },
        updateGrade: {
            type: GradeType,
            args: {
                id: { type: new GraphQLNonNull(GraphQLID) },
                value: { type: GraphQLFloat },
                comment: { type: GraphQLString },
            },
            resolve: async (_, { id, value, comment }, { user }) => {
                if (!user || user.role !== "professor") {
                    throw new Error("Not authorized");
                }

                const grade = await Grade.findById(id);
                if (!grade) throw new Error("Grade not found");

                // Vérifier si le professeur est propriétaire de la note
                if (grade.professorId.toString() !== user.id) {
                    throw new Error("Not authorized to update this grade");
                }

                const updates = {};
                if (value !== undefined) updates.value = value;
                if (comment !== undefined) updates.comment = comment;

                return Grade.findByIdAndUpdate(id, updates, { new: true });
            },
        },
        deleteGrade: {
            type: GraphQLBoolean,
            args: {
                id: { type: new GraphQLNonNull(GraphQLID) },
            },
            resolve: async (_, { id }, { user }) => {
                if (!user || user.role !== "professor") {
                    throw new Error("Not authorized");
                }

                const grade = await Grade.findById(id);
                if (!grade) throw new Error("Grade not found");

                // Vérifier si le professeur est propriétaire de la note
                if (grade.professorId.toString() !== user.id) {
                    throw new Error("Not authorized to delete this grade");
                }

                await Grade.findByIdAndDelete(id);
                return true;
            },
        },
    },
});

module.exports = mutations;

