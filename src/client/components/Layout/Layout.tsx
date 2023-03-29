'use client';

import React, { FC } from 'react';
import { ToastContainer } from 'react-toastify';

import 'react-toastify/dist/ReactToastify.css';

import { ApolloProvider } from '@apollo/client';
import { client } from '@/utils/apollo';
import LoggedIn from './LoggedIn';

type Props = {
    children: React.ReactNode;
}

const ProviderLayout: FC<Props> = ({ children }) => (
  <ApolloProvider client={client}>
    <ToastContainer />
    {children}
  </ApolloProvider>
);

const Layout: FC<Props> = ({ children }) => (
  <ProviderLayout>
    <div>
      <LoggedIn>
        {children}
      </LoggedIn>
    </div>
  </ProviderLayout>
);

export default Layout;
