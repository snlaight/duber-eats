'use client';

import { ApolloProvider } from '@apollo/client';

import { client } from '@utils/apollo';

type Props = {
    children: React.ReactNode;
}

const Layout = ({ children }: Props) => (
  <main>
    <ApolloProvider client={client}>
      {children}
    </ApolloProvider>
  </main>
);

export default Layout;
