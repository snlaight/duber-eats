import { gql, useQuery } from '@apollo/client';
import { meQuery } from '__generated__/meQuery';
import { ME_QUERY } from 'utils/apollo/queries';

export const useMe = () => useQuery<meQuery>(ME_QUERY);
