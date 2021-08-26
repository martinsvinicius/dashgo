import { ReactNode } from 'react';
import { authApi } from '../../services/api';
import { AuthContext } from '../contexts/AuthContext';
import { SignInCredentials } from '../types/SignInCredentials';

type AuthProviderProps = {
  children: ReactNode;
};

export function AuthProvider({ children }: AuthProviderProps) {
  const isAuthenticated = false;

  async function signIn({ email, password }: SignInCredentials) {
    try {
      const response = await authApi.post('sessions', {
        email,
        password,
      });

      console.log(response);
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <AuthContext.Provider value={{ signIn, isAuthenticated }}>
      {children}
    </AuthContext.Provider>
  );
}
