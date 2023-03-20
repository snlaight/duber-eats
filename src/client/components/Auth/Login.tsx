/* eslint-disable camelcase */

'use client';

import React from 'react';
import Image from 'next/image';
import { useForm, SubmitHandler } from 'react-hook-form';
import { useMutation } from '@apollo/client';

import { isLoggedInVar } from '@/utils/apollo';
import { CustomInput, FormError, Button } from '@/components';
import { LogoColorHorizontal } from '@/assets';
import { LOGIN_MUTATION } from '@/utils/apollo/queries';
import { login } from '@/__generated__/login';

interface IForm {
    email?: string;
    password?: string;
    resultError?: string;
}

type TLoginProps = {
    setFormType: (isLogin: boolean) => void;
}

const Login = ({ setFormType } : TLoginProps) => {
  const { register, getValues, handleSubmit, formState: { errors, isValid } } = useForm<IForm>({
    mode: 'onChange',
  });
  const [errorsFromServer, setErrorsFromServer] = React.useState<string | null>(null);

  const onCompleted = (data: login) => {
    const { login: { ok, token } } = data;
    console.log('data--->', data);
    if (ok) {
      if (typeof window !== 'undefined') {
        localStorage.setItem('token', token || '');
      }
      isLoggedInVar(true);
    }
  };

  const onError = (error: Error) => {
    console.log('error--->', error);
    setErrorsFromServer(error.message);
  };

  const [loginMutation, { data: loginMutationResult, loading }] = useMutation<login>(LOGIN_MUTATION, { onCompleted, onError });

  const onSubmit: SubmitHandler<IForm> = () => {
    if (!loading) {
      const { email, password } = getValues();
      loginMutation({
        variables: {
          loginInput: {
            email,
            password,
          },
        },
      });
    }
  };

  const FormFields = [
    {
      id: 'email',
      type: 'email',
      name: 'email',
      label: 'Email',
      register,
      placeholder: 'Email',
      options: {
        required: { value: true, message: 'Email is required' },
        pattern: { value: /^\S+@\S+$/i, message: 'Invalid email address' },
        message: 'Email is invalid',
      },
      error: errors?.email,
    },
    {
      id: 'password',
      type: 'password',
      name: 'password',
      label: 'Password',
      register,
      options: {
        required: 'Password is required',
        minLength: 5,
      },
      placeholder: 'Password',
      error: errors?.password,
    },
  ];
  return (
    <div className='h-screen flex items-center justify-center'>
      <div className='bg-white w-full max-w-lg pt-10 pb-7 rounded-lg text-center shadow-sm shadow-[#1D3770]'>
        <Image src={LogoColorHorizontal} alt='logo' className='items-center  mx-auto rounded justify-center' />
        <h3 className='text-2xl text-dubereats-primary'>
          Welcome Back!
        </h3>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className='grid gap-3 mt-5 px-5'
        >
          {errorsFromServer && <FormError errorMessage={errorsFromServer} />}
          {React.Children.toArray(FormFields.map((field) => (
            <CustomInput
              id={field.id}
              type={field.type}
              name={field.name}
              label={field.label}
              register={field.register}
              placeholder={field.placeholder}
              options={field.options}
              error={field.error}
            />
          )))}
          <div className='mt-3'>
            <Button fullWidth isSubmit text='Log in' isClickable={isValid} loading={loading} />
          </div>
          {loginMutationResult?.login.error && (
            <FormError errorMessage={loginMutationResult.login.error} />
          )}
        </form>
        <p>
          Don&apos;t have an account? &nbsp;
          <span
            onClick={() => setFormType(false)}
            className='cursor-pointer text-blue-500'
          >
            Sign up
          </span>
        </p>
      </div>
    </div>
  );
};

export default Login;
