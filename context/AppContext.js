import { createContext } from 'react';

function noop() {}

export const AppContext = createContext({
  token: '',
  loading: false,
  message: noop,
  cards: [],
  setCards: noop,
  deleteCard: noop,
  updateCard: noop,
  addCard: noop,
  createAccount: noop,
  login: noop,
  logout: noop,
  isAuthenticated: false,
  setIsAuthenticated: noop,
});
