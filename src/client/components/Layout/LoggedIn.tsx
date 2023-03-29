
import React, { FC } from 'react';
import { useReactiveVar, useQuery } from '@apollo/client';

import { isLoggedInVar } from '@/utils/apollo';
import { useMe } from '@/utils/hooks/useMe';
import { AuthForm, Header } from '..';

type Props = {
    children: React.ReactNode;
}

const LoggedIn: FC<Props> = ({ children }) => {
  const isLoggedIn = useReactiveVar(isLoggedInVar);
  const { data, loading, error } = useMe();
  return (
    <div>
      {isLoggedIn ? (
        <>
          <Header />
          <h1>Logged In: {data?.me.email}</h1>
          <button type='button' onClick={() => isLoggedInVar(false)}>Log Out</button>
          {children}
        </>

      ) : (
        <AuthForm />
      )}
    </div>
  );
};

export default LoggedIn;
