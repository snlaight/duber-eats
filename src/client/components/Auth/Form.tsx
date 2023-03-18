'use client';

import { useState } from 'react';

import Login from './Login';
import SignUp from './SignUp';

const Form = () => {
  const [isLogin, setIsLogin] = useState(true);

  return (
    <div>
      {isLogin ? (
        <Login setFormType={setIsLogin} />
      ) : (
        <SignUp setFormType={setIsLogin} />
      )}
    </div>
  );
};

export default Form;
