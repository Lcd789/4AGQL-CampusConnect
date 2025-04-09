const {
    GraphQLObjectType,
    GraphQLString,
    GraphQLID,
    GraphQLInt,
    GraphQLInputObjectType,
    GraphQLNonNull,
    GraphQLList
} = require("graphql");
const Enrollment = require("../models/Enrollment");
const fetch = require("node-fetch");

// Type pour représenter un utilisateur (professeur ou étudiant)
// Ce type est utilisé pour les résolutions qui impliquent des utilisateurs
const UserType = new GraphQLObjectType({
    name: "User",
    fields: () => ({
        id: { type: GraphQLID },
        email: { type: GraphQLString },
        pseudo: { type: GraphQLString },
        role: { type: GraphQLString }
    }),
});

// Type pour les inscriptions aux classes
const EnrollmentType = new GraphQLObjectType({
    name: "Enrollment",
    fields: () => ({
        id: { type: GraphQLID },
        classId: { type: GraphQLID },
        studentId: { type: GraphQLID },
        enrolledAt: { type: GraphQLString },
        student: {
            type: UserType,
            resolve: async (parent, _, { req }) => {
                try {
                    // Appel au service d'authentification pour obtenir les infos de l'étudiant
                    const authServiceUrl = process.env.AUTH_SERVICE_URL || "http://localhost:8080/graphql";
                    const response = await fetch(authServiceUrl, {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                            "Authorization": req.headers.authorization
                        },
                        body: JSON.stringify({
                            query: `
                                query GetUser($id: ID!) {
                                    user(id: $id) {
                                        id
                                        email
                                        pseudo
                                        role
                                    }
                                }
                            `,
                            variables: { id: parent.studentId }
                        }),
                    });

                    const data = await response.json();
                    return data.data?.user;
                } catch (error) {
                    console.error("Error fetching student:", error);
                    return null;
                }
            }
        }
    }),
});

// Type pour les statistiques de notes d'une classe
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

// Type d'entrée pour créer ou mettre à jour une classe
const ClassInputType = new GraphQLInputObjectType({
    name: 'ClassInput',
    fields: {
        title: { type: new GraphQLNonNull(GraphQLString) },
        description: { type: GraphQLString },
        start: { type: new GraphQLNonNull(GraphQLString) },
        end: { type: new GraphQLNonNull(GraphQLString) },
        room: { type: new GraphQLNonNull(GraphQLString) },
        color: { type: GraphQLString },
        courseId: { type: GraphQLID } // Pour lier la classe à un cours
    }
});

// Type principal pour une classe
const ClassType = new GraphQLObjectType({
    name: 'Class',
    fields: () => ({
        id: { type: GraphQLID },
        title: { type: GraphQLString },
        description: { type: GraphQLString },
        start: { type: GraphQLString },
        end: { type: GraphQLString },
        room: { type: GraphQLString },
        color: { type: GraphQLString },
        professorId: { type: GraphQLID },
        courseId: { type: GraphQLID },
        // Résolution du professeur à partir du service d'authentification
        professor: {
            type: UserType,
            resolve: async (parent, _, { req }) => {
                try {
                    // Appel au service d'authentification pour obtenir les infos du professeur
                    const authServiceUrl = process.env.AUTH_SERVICE_URL || "http://localhost:8080/graphql";
                    const response = await fetch(authServiceUrl, {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                            "Authorization": req.headers.authorization
                        },
                        body: JSON.stringify({
                            query: `
                                query GetUser($id: ID!) {
                                    user(id: $id) {
                                        id
                                        email
                                        pseudo
                                        role
                                    }
                                }
                            `,
                            variables: { id: parent.professorId }
                        }),
                    });

                    const data = await response.json();
                    return data.data?.user;
                } catch (error) {
                    console.error("Error fetching professor:", error);
                    return null;
                }
            }
        },

        // Résolution des inscriptions des étudiants pour cette classe
        enrollments: {
            type: new GraphQLList(EnrollmentType),
            resolve: async (parent) => {
                return Enrollment.find({ classId: parent.id });
            }
        },
        // Résolution pour obtenir les statistiques de notes de cette classe
        gradeStats: {
            type: ClassGradeStatsType,
            resolve: async (parent, _, { user, req }) => {
                if (!user || user.role !== "professor") {
                    return null;
                }

                try {
                    const gradeServiceUrl = process.env.GRADE_SERVICE_URL || "http://localhost:8081/graphql";
                    const response = await fetch(gradeServiceUrl, {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                            "Authorization": req.headers.authorization
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
                            variables: { courseId: parent.courseId }
                        }),
                    });

                    const data = await response.json();
                    const stats = data.data?.courseGradeStats || {
                        median: 0,
                        lowest: 0,
                        highest: 0,
                        average: 0
                    };

                    return {
                        classId: parent.id,
                        className: parent.title,
                        ...stats
                    };
                } catch (error) {
                    console.error("Error fetching grade stats:", error);
                    return null;
                }
            }
        }
    })
});

module.exports = {
    ClassType,
    EnrollmentType,
    ClassGradeStatsType,
    UserType,
    ClassInputType
};