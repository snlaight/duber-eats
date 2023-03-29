/* eslint-disable no-shadow */

'use client';

import React, { FC, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useMutation, useApolloClient, gql } from '@apollo/client';

import { verifyEmail, verifyEmailVariables } from '@/__generated__/verifyEmail';
import { VERIFY_EMAIL_MUTATION } from '@/utils/apollo/queries';
import { useMe } from '@/utils/hooks/useMe';

const ConfirmEmailPage : FC = () => {
  const { data: userData } = useMe();
  const client = useApolloClient();
  const router = useRouter();

  const onCompleted = (data: verifyEmail) => {
    const { verifyEmail: { ok, error } } = data;

    if (ok && userData?.me.id) {
      client.writeFragment({
        id: `User:${userData.me.id}`,
        fragment: gql`
            fragment VerifiedUser on User {
                verified
            }
        `,
        data: {
          verified: true,
        },
      });
      router.push('/');
    }
  };

  const [verifyEmail] = useMutation<verifyEmail, verifyEmailVariables>(VERIFY_EMAIL_MUTATION, {
    onCompleted,
  });

  useEffect(() => {
    const [_, code] = window.location.href.split('code=');
    verifyEmail({
      variables: {
        input: {
          code,
        },
      },
    });
  }, [verifyEmail]);
  return (
    <div className='mt-52 flex flex-col items-center justify-center'>
      <h2 className='text-lg mb-1 font-medium'>Confirming your email...</h2>
      <h4 className='text-gray-700 text-sm'>
        Please wait, don&apos;t close this page...
      </h4>
    </div>
  );
};

export default ConfirmEmailPage;
