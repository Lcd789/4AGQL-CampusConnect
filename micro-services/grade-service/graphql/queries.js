const {
    GraphQLObjectType,
    GraphQLID,
    GraphQLList,
    GraphQLString,
    GraphQLNonNull,
} = require("graphql");
const { CourseType, GradeType, GradeStatsType } = require("./types");
const Course = require("../models/Course");
const Grade = require("../models/Grade");

const queries = new GraphQLObjectType({
    name: "Query",
    fields: {
        courses: {
            type: new GraphQLList(CourseType),
            resolve: async () => {
                return Course.find({});
            },
        },
        course: {
            type: CourseType,
            args: {
                id: { type: new GraphQLNonNull(GraphQLID) },
            },
            resolve: async (_, { id }) => {
                return Course.findById(id);
            },
        },
        myGrades: {
            type: new GraphQLList(GradeType),
            args: {
                courseIds: { type: new GraphQLList(GraphQLID) },
            },
            resolve: async (_, { courseIds }, { user }) => {
                if (!user) throw new Error("Not authenticated");

                const query = { studentId: user.id };
                if (courseIds && courseIds.length > 0) {
                    query.courseId = { $in: courseIds };
                }

                return Grade.find(query);
            },
        },
        studentGrades: {
            type: new GraphQLList(GradeType),
            args: {
                studentId: { type: new GraphQLNonNull(GraphQLID) },
                courseIds: { type: new GraphQLList(GraphQLID) },
            },
            resolve: async (_, { studentId, courseIds }, { user }) => {
                if (!user || user.role !== "professor") {
                    throw new Error("Not authorized");
                }

                const query = { studentId };
                if (courseIds && courseIds.length > 0) {
                    query.courseId = { $in: courseIds };
                }

                return Grade.find(query);
            },
        },
        courseGradeStats: {
            type: GradeStatsType,
            args: {
                courseId: { type: new GraphQLNonNull(GraphQLID) },
            },
            resolve: async (_, { courseId }, { user }) => {
                if (!user || user.role !== "professor") {
                    throw new Error("Not authorized");
                }

                const grades = await Grade.find({ courseId }).select("value");
                const values = grades.map((g) => g.value);

                if (values.length === 0) {
                    return {
                        median: 0,
                        lowest: 0,
                        highest: 0,
                        average: 0,
                    };
                }

                // Calculer les statistiques
                values.sort((a, b) => a - b);
                const lowest = Math.min(...values);
                const highest = Math.max(...values);
                const sum = values.reduce((acc, curr) => acc + curr, 0);
                const average = sum / values.length;

                // Calculer la médiane
                let median;
                const mid = Math.floor(values.length / 2);
                if (values.length % 2 === 0) {
                    median = (values[mid - 1] + values[mid]) / 2;
                } else {
                    median = values[mid];
                }

                return {
                    median,
                    lowest,
                    highest,
                    average,
                };
            },
        },
        _sdl: {
            type: GraphQLString,
            resolve: () => {
                return "GradeService Schema";
            },
        },
    },
});

module.exports = queries;
