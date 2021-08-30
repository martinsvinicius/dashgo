import { ReactNode, useState } from 'react';
import Router from 'next/router';
import { destroyCookie, parseCookies, setCookie } from 'nookies';

import { AuthContext } from '../contexts/AuthContext';
import { SignInCredentials } from '../types/SignInCredentials';
import { User } from '../types/User';
import { useEffect } from 'react';
import { authApi } from '../../services/api/authApiClient';

type AuthProviderProps = {
  children: ReactNode;
};

type SessionResponse = {
  email: string;
  permissions: string[];
  roles: string[];
  name: string;
  token: string;
  refreshToken: string;
};

export function signOut() {
  destroyCookie(undefined, 'dashgo.token');
  destroyCookie(undefined, 'dashgo.refreshToken');

  Router.push('/');
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User>();
  const isAuthenticated = Boolean(user);

  useEffect(() => {
    const { 'dashgo.token': token } = parseCookies();

    if (token) {
      authApi
        .get<User>('/me')
        .then(({ data }) => {
          const { email, permissions, roles, name } = data;

          setUser({ email, permissions, roles, name });
        })
        .catch(() => {
          signOut();
        });
    }
  }, []);

  async function signIn({ email, password }: SignInCredentials) {
    try {
      const { data } = await authApi.post<SessionResponse>('sessions', {
        email,
        password,
      });

      const { permissions, roles, refreshToken, token, name } = data;

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
      setUser({ email, permissions, roles, name });

      authApi.defaults.headers['Authorization'] = `Bearer ${token}`;

      Router.push('/dashboard');
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <AuthContext.Provider value={{ signIn, signOut, user, isAuthenticated }}>
      {children}
    </AuthContext.Provider>
  );
}
