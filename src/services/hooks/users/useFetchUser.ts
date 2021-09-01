import { User } from '../../../auth/types/User';
import { api } from '../../api';
import { queryClient } from '../../query/queryClient';

type ApiResponse = {
  user: User;
};

//data prefetch example
export async function getUser(userId: number): Promise<User> {
  const { data } = await api.get<ApiResponse>(`/users/${userId}`);

  return data.user;
}

export function useFetchUser(userId: number) {
  return queryClient.fetchQuery(['user', userId], () => getUser(userId), {
    staleTime: 1000 * 60 * 1, //1 minute
  });
}
