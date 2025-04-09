import {gql, useQuery} from "@apollo/client";
import {User} from "../types.ts";

export const ME_QUERY = gql`
    query Me {
        me {
            id
            email
            username
            role
        }
    }
`;

export const VALIDATE_TOKEN_QUERY = gql`
    query ValidateToken($token: String!) {
        validateToken(token: $token) {
            id
            email
            username
            role
        }
    }
`;

export const useMe = () => {
    return useQuery<{ me: User }>(ME_QUERY);
};

export const useValidateToken = (token: string) => {
    return useQuery<{ validateToken: User }>(
        VALIDATE_TOKEN_QUERY,
        {variables: {token}, skip: !token}
    );
};
