import { ApolloClient, InMemoryCache, makeVar, createHttpLink } from '@apollo/client';
import crossFetch from 'cross-fetch';

export const isLoggedInVar = makeVar(false);

export const client = new ApolloClient({
  link: createHttpLink({
    uri: 'http://localhost:4000/graphql',
    fetch: crossFetch,
  }),
  cache: new InMemoryCache({
    typePolicies: {
      Query: {
        fields: {
          isLoggedIn: {
            read() {
              return isLoggedInVar();
            },
          },
        },
      },
    },
  }),
});
