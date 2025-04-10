import {gql, useMutation} from "@apollo/client";
import {AuthPayload, LoginInput, RegisterInput} from "../types.ts";

export const LOGIN_MUTATION = gql`
    mutation Login($email: String!, $password: String!) {
        login(email: $email, password: $password) {
            token
            user {
                id
                email
                username
                role
            }
        }
    }
`;

export const REGISTER_MUTATION = gql`
    mutation Register($email: String!, $username: String!, $password: String!, $role: String) {
        register(email: $email, username: $username, password: $password, role: $role) {
            token
            user {
                id
                email
                username
                role
            }
        }
    }
`;

export const REFRESH_TOKEN_MUTATION = gql`
    mutation RefreshToken {
        refreshToken {
            token
            user {
                id
                email
                username
                role
            }
        }
    }
`;

export const useLogin = () => {
    return useMutation<
        { login: AuthPayload },
        LoginInput
    >(LOGIN_MUTATION);
};

export const useRegister = () => {
    return useMutation<
        { register: AuthPayload },
        RegisterInput
    >(REGISTER_MUTATION);
};

export const useRefreshToken = () => {
    return useMutation<
        { refreshToken: AuthPayload }
    >(REFRESH_TOKEN_MUTATION);
};


