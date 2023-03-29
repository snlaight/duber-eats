import { ApolloClient, InMemoryCache, makeVar, createHttpLink } from '@apollo/client';
import { setContext } from '@apollo/client/link/context';
import crossFetch from 'cross-fetch';

import { LOCAL_STORAGE_TOKEN } from '@/utils/constants';

const token = localStorage.getItem(LOCAL_STORAGE_TOKEN);
export const isLoggedInVar = makeVar(Boolean(token));
export const authTokenVar = makeVar(token);

const httpLink = createHttpLink({
  uri: 'http://localhost:4000/graphql',
  fetch: crossFetch,
});

const authLink = setContext((_, { headers }) => ({
  headers: {
    ...headers,
    'x-jwt': authTokenVar() || '',
  },
}));

export const client = new ApolloClient({
  link: authLink.concat(httpLink),
  cache: new InMemoryCache({
    typePolicies: {
      Query: {
        fields: {
          isLoggedIn: {
            read() {
              return isLoggedInVar();
            },
          },
          token: {
            read() {
              return authTokenVar();
            },
          },
        },
      },
    },
  }),
});
