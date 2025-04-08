const {
    GraphQLObjectType,
    GraphQLString,
    GraphQLID,
    GraphQLFloat,
} = require("graphql");
const Course = require("../models/Course");

// GraphQL Types
const CourseType = new GraphQLObjectType({
    name: "Course",
    fields: () => ({
        id: { type: GraphQLID },
        name: { type: GraphQLString },
        description: { type: GraphQLString },
        professorId: { type: GraphQLID },
    }),
});

const GradeType = new GraphQLObjectType({
    name: "Grade",
    fields: () => ({
        id: { type: GraphQLID },
        studentId: { type: GraphQLID },
        courseId: { type: GraphQLID },
        professorId: { type: GraphQLID },
        value: { type: GraphQLFloat },
        comment: { type: GraphQLString },
        createdAt: { type: GraphQLString },
        course: {
            type: CourseType,
            resolve: async (parent) => {
                return Course.findById(parent.courseId);
            },
        },
    }),
});

const GradeStatsType = new GraphQLObjectType({
    name: "GradeStats",
    fields: () => ({
        median: { type: GraphQLFloat },
        lowest: { type: GraphQLFloat },
        highest: { type: GraphQLFloat },
        average: { type: GraphQLFloat },
    }),
});

module.exports = {
    CourseType,
    GradeType,
    GradeStatsType,
};
