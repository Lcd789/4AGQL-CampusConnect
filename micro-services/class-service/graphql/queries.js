const {
    GraphQLList,
    GraphQLID,
    GraphQLNonNull,
    GraphQLString,
} = require("graphql");
const fetch = require("node-fetch");
const Class = require("../models/Class");
const Enrollment = require("../models/Enrollment");
const { ClassType, EnrollmentType, ClassGradeStatsType } = require("./types");

const queries = {
    classes: {
        type: new GraphQLList(ClassType),
        args: {
            sortBy: { type: GraphQLString },
        },
        resolve: async (_, { sortBy }) => {
            let sort = {};
            if (sortBy === "name") {
                sort = { title: 1 };
            }
            return Class.find({}).sort(sort);
        },
    },
    class: {
        type: ClassType,
        args: {
            id: { type: new GraphQLNonNull(GraphQLID) },
        },
        resolve: async (_, { id }) => {
            return Class.findById(id);
        },
    },
    myClasses: {
        type: new GraphQLList(ClassType),
        resolve: async (_, __, { user }) => {
            if (!user) throw new Error("Not authenticated");

            if (user.role === "professor") {
                return Class.find({ professorId: user.id });
            } else {
                const enrollments = await Enrollment.find({
                    studentId: user.id,
                });
                const classIds = enrollments.map((e) => e.classId);
                return Class.find({ _id: { $in: classIds } });
            }
        },
    },
    classEnrollments: {
        type: new GraphQLList(EnrollmentType),
        args: {
            classId: { type: new GraphQLNonNull(GraphQLID) },
        },
        resolve: async (_, { classId }, { user }) => {
            if (!user) throw new Error("Not authenticated");

            // Vérifier si l'utilisateur est professeur ou étudiant dans cette classe
            if (user.role === "professor") {
                const classObj = await Class.findById(classId);
                if (!classObj || classObj.professorId.toString() !== user.id) {
                    throw new Error("Not authorized");
                }
            } else {
                const enrollment = await Enrollment.findOne({
                    classId,
                    studentId: user.id,
                });
                if (!enrollment) {
                    throw new Error("Not enrolled in this class");
                }
            }

            return Enrollment.find({ classId });
        },
    },
    classGradeStats: {
        type: ClassGradeStatsType,
        args: {
            classId: { type: new GraphQLNonNull(GraphQLID) },
        },
        resolve: async (_, { classId }, { user, req }) => {
            if (!user || user.role !== "professor") {
                throw new Error("Not authorized");
            }

            // Vérifier si le professeur est responsable de cette classe
            const classObj = await Class.findById(classId);
            if (!classObj || classObj.professorId.toString() !== user.id) {
                throw new Error("Not authorized");
            }

            // Récupérer les inscriptions d'étudiants pour cette classe
            const enrollments = await Enrollment.find({ classId });
            const studentIds = enrollments.map((e) => e.studentId.toString());

            // Récupérer les notes des étudiants pour ce cours
            const gradeServiceUrl =
                process.env.GRADE_SERVICE_URL ||
                "http://localhost:8081/graphql";

            try {
                // Cette requête est complexe car nous devons obtenir les notes de plusieurs étudiants
                // pour le cours associé à cette classe
                const response = await fetch(gradeServiceUrl, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: req.headers.authorization,
                    },
                    body: JSON.stringify({
                        query: `
                query GetCourseGradeStats($courseId: ID!) {
                  courseGradeStats(courseId: $courseId) {
                    median
                    lowest
                    highest
                    average
                  }
                }
              `,
                        variables: { courseId: classObj.courseId },
                    }),
                });

                const data = await response.json();
                const stats = data.data?.courseGradeStats || {
                    median: 0,
                    lowest: 0,
                    highest: 0,
                    average: 0,
                };

                return {
                    classId: classObj.id,
                    className: classObj.name,
                    ...stats,
                };
            } catch (error) {
                console.error("Error fetching grade stats:", error);
                throw new Error("Failed to fetch grade statistics");
            }
        },
    },

    professorClasses: {
        type: new GraphQLList(ClassType),
        resolve: async (_, __, { user }) => {
            //console.log("Context complet:", JSON.stringify(context, null, 2));
            //console.log("User dans le contexte:", context.user);

            if (!user) throw new Error("Not authenticated");

            console.log("User dans le contexte:", user);

            if (!user || user.role !== "professor") {
                throw new Error("Not authorized");
            }

            return Class.find({ professorId: user.id });
        },
    },


    // Removed _sdl field to avoid conflicts with API gateway
};

module.exports = queries;
