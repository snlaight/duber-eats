'use client';

import React, { FC } from 'react';
import { useQuery } from '@apollo/client';

import { restaurantsPageQuery, restaurantsPageQueryVariables } from '@/__generated__/restaurantsPageQuery';
import { RESTAURANTS_QUERY } from '@/utils/apollo/queries';

const RestaurantsPage: FC = () => {
  const { data, loading } = useQuery<restaurantsPageQuery, restaurantsPageQueryVariables>(RESTAURANTS_QUERY, {
    variables: {
      input: {
        page: 1,
      },
    },
  });
  return (
    <div>
      <form className='bg-gray-800 w-full py-40 flex items-center justify-center'>
        <input type='search' className='input rounded-md border-0 w-3/12' placeholder='Search restaurants...' />
      </form>
      {!loading && (
        <div className='max-w-screen-2xl mx-auto mt-8'>
          <div className='flex justify-around max-w-sm mx-auto'>
            {React.Children.toArray((data.allCategories.categories?.map((category) => ( 
              <div className='flex flex-col items-center cursor-pointer'>
                <div />
                <span className='mt-1 text-sm text-center font-medium'>
                  {category.name}
                </span>
              </div>
            ))))}
          </div>
        </div>
      )}
    </div>
  );
};

export default RestaurantsPage;
