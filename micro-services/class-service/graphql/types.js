const {
    GraphQLObjectType,
    GraphQLString,
    GraphQLID,
    GraphQLInt,
} = require("graphql");
const Enrollment = require("../models/Enrollment");

// GraphQL Types
const ClassType = new GraphQLObjectType({
    name: "Class",
    fields: () => ({
        id: { type: GraphQLID },
        name: { type: GraphQLString },
        description: { type: GraphQLString },
        professorId: { type: GraphQLID },
        courseId: { type: GraphQLID },
        studentCount: {
            type: GraphQLInt,
            resolve: async (parent) => {
                return Enrollment.countDocuments({ classId: parent.id });
            },
        },
    }),
});

const EnrollmentType = new GraphQLObjectType({
    name: "Enrollment",
    fields: () => ({
        id: { type: GraphQLID },
        classId: { type: GraphQLID },
        studentId: { type: GraphQLID },
        enrolledAt: { type: GraphQLString },
    }),
});

const ClassGradeStatsType = new GraphQLObjectType({
    name: "ClassGradeStats",
    fields: () => ({
        classId: { type: GraphQLID },
        className: { type: GraphQLString },
        median: { type: GraphQLInt },
        lowest: { type: GraphQLInt },
        highest: { type: GraphQLInt },
        average: { type: GraphQLInt },
    }),
});

module.exports = { ClassType, EnrollmentType, ClassGradeStatsType };
