import { createContext } from 'react';

function noop() {}

export const AuthContext = createContext({
  token: null,
  loading: false,
  createAccount: noop,
  login: noop,
  logout: noop,
  isAuthenticated: false,
  setIsAuthenticated: noop,
});
