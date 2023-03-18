import React from 'react';
import { useForm } from 'react-hook-form';
import Image from 'next/image';

import { LogoColorHorizontal } from '@/assets';
import { CustomInput } from '@/components';

interface IForm {
    email: string;
    password: string;
  }

type TLoginProps = {
    setFormType: (isLogin: boolean) => void;
}

const SignUp = ({ setFormType } : TLoginProps) => {
  const { register, watch, handleSubmit, formState: { errors } } = useForm<IForm>();
  const onSubmit = () => {
    console.log(watch());
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
          Sign Up
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
          <button type='submit' className='mt-3 btn capitalize'>
            Sign up
          </button>
        </form>
        <p>
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
