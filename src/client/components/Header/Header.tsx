import React, { FC } from 'react';
import { faUser } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Image from 'next/image';
import Link from 'next/link';

import { LogoNoBg } from '@/assets';
import { useMe } from '@/utils/hooks/useMe';

const Header: FC = () => {
  const { data } = useMe();

  return (
    <>
      {!data?.me.verified && (
        <div className='bg-red-500 p-3 text-center text-base text-white'>
          <span> Please verify your email.</span>
        </div>
      )}
      <header className=''>
        <div className='w-full px-5 xl:px-0 max-w-screen-2xl mx-auto flex justify-between items-center'>
          <Link href='/'>
            <Image src={LogoNoBg} className='w-44 my-auto' alt='logo' />
          </Link>
          <Link href='/edit-profile' className='text-xs'>
            <FontAwesomeIcon icon={faUser} className='text-3xl' />
          </Link>
        </div>
      </header>

    </>
  );
};

export default Header;
