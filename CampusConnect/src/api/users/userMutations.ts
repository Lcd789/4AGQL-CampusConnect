import { gql, useMutation } from "@apollo/client";
import { User } from "../types.ts";

export const UPDATE_USER_ROLE_MUTATION = gql`
    mutation UpdateUserRole($userId: ID!, $role: String!) {
        updateUserRole(userId: $userId, role: $role) {
            id
            email
            username
            role
        }
    }
`;

export const UPDATE_USER_MUTATION = gql`
    mutation UpdateUser($username: String, $password: String) {
        updateUser(username: $username, password: $password) {
            id
            email
            username
            role
        }
    }
`;

export const DELETE_USER_MUTATION = gql`
    mutation DeleteUser($userId: ID!) {
        deleteUser(userId: $userId) {
            id
        }
    }
`;


// Hook pour mettre à jour le rôle d'un utilisateur (pour les professeurs)
export const useUpdateUserRole = () => {
    return useMutation<
        { updateUserRole: User },
        { userId: string; role: string }
    >(UPDATE_USER_ROLE_MUTATION);
};

// Hook pour mettre à jour n'importe quel utilisateur (pour les professeurs)
export const useUpdateUser = () => {
    return useMutation<
        { updateUser: User },
        {
            username?: string;
            password?: string;
        }
    >(UPDATE_USER_MUTATION);
};

export const useDeleteUser = () => {
    return useMutation<
        { deleteUser: { id: string } },
        { userId: string }
    >(DELETE_USER_MUTATION);
};
