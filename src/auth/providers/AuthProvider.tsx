import { ReactNode } from 'react';
import { AuthContext } from '../contexts/AuthContext';
import { SignInCredentials } from '../types/SignInCredentials';

type AuthProviderProps = {
  children: ReactNode;
};

export function AuthProvider({ children }: AuthProviderProps) {
  const isAuthenticated = false;

  async function signIn({ email, password }: SignInCredentials) {
    console.log({ email, password });
  }

  return (
    <AuthContext.Provider value={{ signIn, isAuthenticated }}>
      {children}
    </AuthContext.Provider>
  );
}
