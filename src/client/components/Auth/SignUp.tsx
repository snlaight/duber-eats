'use client';

/* eslint-disable no-shadow */
import React, { FC, useState } from 'react';
import { useForm } from 'react-hook-form';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useMutation } from '@apollo/client';
import { toast } from 'react-toastify';

import { LogoColorHorizontal } from '@/assets';
import { CustomInput, FormError, Button } from '@/components';
import { UserRole } from '@/__generated__/globalTypes';
import { createAccountMutation, createAccountMutationVariables } from '@/__generated__/createAccountMutation';
import { CREATE_ACCOUNT_MUTATION } from '@/utils/apollo/queries';

interface IForm {
    email: string;
    password: string;
    role: UserRole;
  }

type TLoginProps = {
    setFormType: (isLogin: boolean) => void;
}

const SignUp : FC<TLoginProps> = ({ setFormType }) => {
  const { register, getValues, handleSubmit, formState: { errors, isValid } } = useForm<IForm>({
    mode: 'onChange',
    defaultValues: {
      role: UserRole.Client,
    },
  });

  const onCompleted = (data: createAccountMutation) => {
    const { createAccount: { ok } } = data;
    if (ok) {
      toast.success('Account created! Please wait while we redirect you to the login page...');
      setTimeout(() => {
        setFormType(true);
      }, 5000);
    }
  };

  const [createAccountMutation, { data: createAccountMutationResult, loading }] = useMutation<createAccountMutation, createAccountMutationVariables>(CREATE_ACCOUNT_MUTATION, {
    onCompleted,
  });

  const onSubmit = () => {
    if (!loading) {
      const { email, password, role } = getValues();
      createAccountMutation({
        variables: {
          createAccountInput: {
            email,
            password,
            role,
          },
        },
      });
    }
  };
  const onInvalid = () => {
    console.log('invalid');
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
        minLength: 10,
      },
      placeholder: 'Password',
      error: errors?.password,
    },
  ];

  return (
    <div className='h-screen flex items-center justify-center'>
      <div className='bg-white w-full max-w-lg pt-10 pb-7 rounded-lg text-center shadow-sm shadow-[#1D3770]'>
        <Image src={LogoColorHorizontal} alt='logo' className='items-center justify-center' />
        <h3 className='text-2xl text-dubereats-primary'>
          {loading ? 'Loading...' : 'Sign Up'}
        </h3>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className='grid gap-3 mt-5 px-5'
        >
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
          <select name='role' {...register('role')} required className='input'>
            {React.Children.toArray(Object.keys(UserRole).map((role) => (
              <option value={role}>{role}</option>
            )))}
          </select>
          <div className='mt-3 transition-all'>
            <Button fullWidth isSubmit text='Sign Up' isClickable={isValid} loading={loading} />

          </div>

          {createAccountMutationResult?.createAccount.error && (
          <FormError errorMessage={createAccountMutationResult.createAccount.error} />
          )}
        </form>
        <p className='text-gray-600 text-xs my-3'>
          Already have an account? {' '}
          <span
            onClick={() => setFormType(true)}
            className='cursor-pointer text-blue-500'
          >
            Login
          </span>
        </p>
      </div>
    </div>
  );
};

export default SignUp;
