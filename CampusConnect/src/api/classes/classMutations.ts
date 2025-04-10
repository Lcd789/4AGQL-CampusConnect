import { gql, useMutation } from '@apollo/client';
import { Class, ClassInput, Enrollment } from '../types.ts';

export const CREATE_CLASS = gql`
    mutation CreateClass($input: ClassInput!) {
        createClass(input: $input) {
            id
            title
            description
            start
            end
            room
            color
            professorId
        }
    }
`;

export const UPDATE_CLASS = gql`
    mutation UpdateClass($id: ID!, $input: ClassInput!) {
        updateClass(id: $id, input: $input) {
            id
            title
            description
            start
            end
            room
            color
        }
    }
`;

export const DELETE_CLASS = gql`
    mutation DeleteClass($id: ID!) {
        deleteClass(id: $id)
    }
`;

export const ENROLL_STUDENT = gql`
    mutation EnrollStudent($classId: ID!, $studentId: ID!) {
        enrollStudent(classId: $classId, studentId: $studentId) {
            id
            classId
            studentId
            enrolledAt
        }
    }
`;

export const REMOVE_STUDENT = gql`
    mutation RemoveStudentFromClass($classId: ID!, $studentId: ID!) {
        removeStudentFromClass(classId: $classId, studentId: $studentId)
    }
`;

// Hook functions for mutations

export const useCreateClass = () => {
    return useMutation<
        { createClass: Class },
        { input: ClassInput }
    >(CREATE_CLASS);
};

export const useUpdateClass = () => {
    return useMutation<
        { updateClass: Class },
        { id: string, input: ClassInput }
    >(UPDATE_CLASS);
};

export const useDeleteClass = () => {
    return useMutation<
        { deleteClass: boolean },
        { id: string }
    >(DELETE_CLASS);
};

export const useEnrollStudent = () => {
    return useMutation<
        { enrollStudent: Enrollment },
        { classId: string, studentId: string }
    >(ENROLL_STUDENT);
};

export const useRemoveStudent = () => {
    return useMutation<
        { removeStudentFromClass: boolean },
        { classId: string, studentId: string }
    >(REMOVE_STUDENT);
};