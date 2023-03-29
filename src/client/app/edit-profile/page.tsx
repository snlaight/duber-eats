/* eslint-disable no-shadow */
/* eslint-disable @typescript-eslint/no-unused-vars */

'use client';

import React, { FC } from 'react';
import { useMutation, useApolloClient, gql } from '@apollo/client';
import { useForm } from 'react-hook-form';

import { Button, CustomInput } from '@/components';
import { useMe } from '@/utils/hooks/useMe';
import { editProfile, editProfileVariables } from '@/__generated__/editProfile';
import { EDIT_PROFILE_MUTATION } from '@/utils/apollo/queries';

interface IFormProps {
    email?: string;
    password?: string;
}

const EditProfilePage: FC = () => {
  const { data: userData } = useMe();
  const client = useApolloClient();
  const { register, handleSubmit, getValues, formState: { errors, isValid } } = useForm<IFormProps>({
    mode: 'onChange',
  });

  const onCompleted = (data: editProfile) => {
    const { editProfile: { ok, error } } = data;
    if (ok) {
      if (ok && userData) {
        const { me: { email, id } } = userData;
        const { email: newEmail } = getValues();
        if (email !== newEmail) {
          client.writeFragment({
            id: `User:${id}`,
            fragment: gql`
                fragment EditedUser on User {
                    verified
                    email
                }
            `,
            data: {
              verified: false,
              email: newEmail,
            },
          });
        }
      }
    }
  };

  const [editProfile, { loading }] = useMutation<editProfile, editProfileVariables>(EDIT_PROFILE_MUTATION, {
    onCompleted,
  });

  const onSubmit = () => {
    const { email, password } = getValues();
    editProfile({
      variables: {
        input: {
          email,
          ...(password !== '' && { password }),
        },
      },
    });
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
      default: userData?.me.email,
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
    <div className='mt-52 flex flex-col justify-center items-center'>
      <h4 className='font-semibold text-2xl mb-3'>
        Edit Profile
      </h4>
      <form className='grid max-w-screen-sm gap-3 mt-5 w-full mb-5 ' onSubmit={handleSubmit(onSubmit)}>
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
            {...(field.default && { defaultValue: field.default })}
          />
        )))}
        <Button isClickable={isValid} loading={loading} text='Save Profile' isSubmit />
      </form>
    </div>
  );
};

export default EditProfilePage;
