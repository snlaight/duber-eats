'use client';

import { ApolloProvider } from '@apollo/client';
import { client } from '@/utils/apollo';
import LoggedIn from './LoggedIn';

type Props = {
    children: React.ReactNode;
}

const ProviderLayout = ({ children }: Props) => (
  <ApolloProvider client={client}>
    {children}
  </ApolloProvider>
);

const Layout = ({ children }: Props) => (
  <ProviderLayout>
    <body>
      <LoggedIn>
        {children}
      </LoggedIn>
    </body>
  </ProviderLayout>
);

export default Layout;
