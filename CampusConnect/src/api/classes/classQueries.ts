import {gql, useQuery} from '@apollo/client';
import {Class, Enrollment} from '../types.ts';

export const GET_PROFESSOR_CLASSES = gql`
    query GetProfessorClasses {
        myClasses {
            id
            title
            description
            start
            end
            room
            color
            courseId
        }
    }
`;

export const GET_CLASS_DETAIL = gql`
    query GetClassDetail($id: ID!) {
        class(id: $id) {
            id
            title
            description
            start
            end
            room
            color
            courseId
            professor {
                id
                pseudo
                email
            }
            enrollments {
                id
                studentId
                enrolledAt
                student {
                    id
                    pseudo
                    email
                }
            }
            gradeStats {
                median
                lowest
                highest
                average
            }
        }
    }
`;

export const GET_CLASS_ENROLLMENTS = gql`
    query GetClassEnrollments($classId: ID!) {
        classEnrollments(classId: $classId) {
            id
            studentId
            enrolledAt
            student {
                id
                pseudo
                email
            }
        }
    }
`;

export const useProfessorClasses = () => {
    return useQuery<{ professorClasses: Class[] }>(
        GET_PROFESSOR_CLASSES,
        {
            context: {
                headers: {
                    authorization: localStorage.getItem('token')
                        ? `Bearer ${localStorage.getItem('token')}`
                        : ""
                }
            }
            ,
            fetchPolicy: 'network-only'
        }
    )
        ;
};

export const useClassDetail = (id: string) => {
    return useQuery<{ class: Class }>(
        GET_CLASS_DETAIL,
        {variables: {id}, skip: !id}
    );
};

export const useClassEnrollments = (classId: string) => {
    return useQuery<{ classEnrollments: Enrollment[] }>(
        GET_CLASS_ENROLLMENTS,
        {variables: {classId}, skip: !classId}
    );
};