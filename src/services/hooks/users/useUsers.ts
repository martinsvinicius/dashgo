import { useQuery } from 'react-query';
import { User } from '../../../auth/types/User';
import { authApi } from '../../api/authApiClient';

interface ApiResponse {
  users: User[];
  total: number;
}

type GetUsersResponse = {
  users: User[];
  totalCount: number;
}

export async function getUsers(currentPage: number): Promise<GetUsersResponse> {
  const { data, headers } = await authApi.get<ApiResponse>('/users', {
    params: {
      page: currentPage,
    },
  });

  const users = data.users.map((user) => {
    return {
      name: user.name,
      email: user.email,
      createdAt: new Date(user.createdAt).toLocaleDateString('pt-BR', {
        day: '2-digit',
        month: 'long',
        year: 'numeric',
      }),
      permissions: user.permissions,
      roles: user.roles
    };
  });

  const totalCount = data.total;

  return {
    users,
    totalCount,
  };
}

export function useUsers(currentPage: number) {
  return useQuery(['users', currentPage], () => getUsers(currentPage), {
    staleTime: 1000 * 60 * 5, //5 minutes
  });
}
