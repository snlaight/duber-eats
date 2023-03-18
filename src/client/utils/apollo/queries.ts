import { gql } from '@apollo/client';

export const LOGIN_MUTATION = gql`
mutation login($loginInput: LoginInput!) {
    login(input: $loginInput) {
        ok
        token
        error
    }
}
`;
