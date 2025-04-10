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

export const useUser = (id: string) => {
    return useQuery<{ user: User }>(
        USER_QUERY,
        { variables: { id }, skip: !id }
    );
};

export const useUsers = () => {
    return useQuery<{ users: User[] }>(USERS_QUERY);
};