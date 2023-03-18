
import React from 'react';
import { useReactiveVar } from '@apollo/client';

import { isLoggedInVar } from '@/utils/apollo';
import { AuthForm } from '..';

type Props = {
    children: React.ReactNode;
}

const LoggedIn = ({ children }: Props) => {
  const isLoggedIn = useReactiveVar(isLoggedInVar);
  return (
    <div>
      {isLoggedIn ? (
        <>
          <h1>Logged In</h1>
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
