import { createContext } from 'react';
import { SignInCredentials } from '../types/SignInCredentials';
import { User } from '../types/User';

type AuthContextData = {
  signIn(credentials: SignInCredentials): Promise<void>;
  signOut(): Promise<void>;
  user: User;
  isAuthenticated: boolean;
};

export const AuthContext = createContext<AuthContextData>(
  {} as AuthContextData
);
