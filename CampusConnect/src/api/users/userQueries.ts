import { gql, useQuery } from "@apollo/client";
import { User } from "../types.ts";

export const USER_QUERY = gql`
    query User($id: ID!) {
        user(id: $id) {
            id
            email
            username
            role
        }
    }
`;

export const USERS_QUERY = gql`
    query Users {
        users {
            id
            email
            username
            role
        }
    }
`;

// Hook pour récupérer un utilisateur par ID
export const useUser = (id: string) => {
    return useQuery<{ user: User }>(
        USER_QUERY,
        { variables: { id }, skip: !id }
    );
};

// Hook pour récupérer tous les utilisateurs (accessible uniquement aux professeurs)
export const useUsers = () => {
    return useQuery<{ users: User[] }>(USERS_QUERY);
};