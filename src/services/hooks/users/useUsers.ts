import { useQuery } from 'react-query';
import { User } from '../../../models/User';
import { api } from '../../api';

interface ApiResponse {
  users: User[];
}

type GetUsersResponse = {
  users: User[];
  totalCount: number;
}

export async function getUsers(currentPage: number): Promise<GetUsersResponse> {
  const { data, headers } = await api.get<ApiResponse>('/users', {
    params: {
      page: currentPage,
    },
  });

  const users = data.users.map((user) => {
    return {
      id: user.id,
      name: user.name,
      email: user.email,
      createdAt: new Date(user.createdAt).toLocaleDateString('pt-BR', {
        day: '2-digit',
        month: 'long',
        year: 'numeric',
      }),
    };
  });

  const totalCount = Number(headers['x-total-count']);

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
