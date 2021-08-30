import { ReactNode, useState } from 'react';
import Router from 'next/router';
import { setCookie } from 'nookies';

import { authApi } from '../../services/api';
import { AuthContext } from '../contexts/AuthContext';
import { SignInCredentials } from '../types/SignInCredentials';
import { User } from '../types/User';

type AuthProviderProps = {
  children: ReactNode;
};

type SignInResponse = {
  email: string;
  permissions: string[];
  roles: string[];
  name: string;
  token: string;
  refreshToken: string;
};

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User>();

  const isAuthenticated = Boolean(user);

  async function signIn({ email, password }: SignInCredentials) {
    try {
      const response = await authApi.post<SignInResponse>('sessions', {
        email,
        password,
      });

      const { permissions, roles, refreshToken, token, name } = response.data;

      //setting cookies
      setCookie(undefined, 'dashgo.token', token, {
        maxAge: 60 * 60 * 24 * 30, // 30 days
        path: '/',
      });

      setCookie(undefined, 'dashgo.refreshToken', refreshToken, {
        maxAge: 60 * 60 * 24 * 30, // 30 days
        path: '/',
      });

      //setting state
      setUser({
        email,
        permissions,
        roles,
        name,
      });

      Router.push('/dashboard');
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <AuthContext.Provider value={{ signIn, user, isAuthenticated }}>
      {children}
    </AuthContext.Provider>
  );
}
