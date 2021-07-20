import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import jwt from 'jsonwebtoken';
import axios from 'axios';
import { API_BASE_URL } from '../constants';

export const useApi = () => {
  const router = useRouter();
  const [token, setToken] = useState('');
  const [tokenReady, setTokenReady] = useState(false);
  const [cards, setCards] = useState([]);
  const [loading, setLoading] = useState(false);

  axios.defaults.baseURL = API_BASE_URL;
  axios.interceptors.request.use(
    function (config) {
      if (isTokenRefreshNeeded()) {
        refreshToken();
      }
      return config;
    },
    function (err) {
      return Promise.reject(err);
    }
  );

  useEffect(() => {
    setToken(localStorage.getItem('token'));
    setTokenReady(true);
  }, []);

  useEffect(() => {
    const getCards = async () => {
      try {
        const data = await request({
          method: 'get',
          url: `/cards/`,
          headers: {
            Authorization: `JWT ${token}`,
          },
        });
        return setCards(data);
      } catch (err) {}
    };

    if (tokenReady) getCards();
  }, [token, tokenReady]);

  const request = async (config) => {
    setLoading(true);

    try {
      const response = await axios(config);

      setLoading(false);

      return response.data;
    } catch (err) {
      setLoading(false);
      console.log(err.message || `request error`);
    }
  };

  const createAccount = async (username, email, password) => {
    try {
      const data = await request({
        method: 'post',
        url: `/users/create/`,
        data: {
          username,
          email,
          password,
        },
      });

      setToken(data?.token || null);
      localStorage.setItem('token', data?.token || '');
      return router.push('/');
    } catch (err) {
      console.log(`create account error: `, err);
    }
  };

  const login = async (username, password) => {
    try {
      const data = await request({
        method: 'post',
        url: `/users/login/`,
        data: {
          username,
          password,
        },
      });

      setToken(data.token || null);
      localStorage.setItem('token', data.token || '');
      return router.push('/');
    } catch (err) {
      console.log(err.message || 'login error');
    }
  };

  const logout = () => {
    setToken(null);
    localStorage.removeItem('token');
  };

  const refreshToken = async (token) => {
    try {
      const data = await request({
        method: 'post',
        url: `/users/refresh_token/`,
        data: {
          token,
        },
        headers: { Authorization: `Bearer ${token}` },
      });
      setToken(data.token);
      localStorage.setItem('token', data.token || '');
    } catch (err) {
      console.log(`refresh token error: `, err);
    }
  };

  const isTokenExpired = () => {
    if (tokenReady) {
      if (token) {
        const { exp } = jwt.decode(token);
        return exp < Date.now() / 1000;
      }

      return true;
    }
  };

  const isTokenRefreshNeeded = () => {
    if (tokenReady) {
      if (!token) return false;

      const { exp } = jwt.decode(token);
      const currentTime = Date.now() / 1000;
      const refreshThreshold = exp * 0.7;

      return currentTime < refreshThreshold;
    }
  };

  const addCard = async (row, text) => {
    try {
      const data = await request({
        method: 'post',
        url: `/cards/`,
        data: {
          row,
          text,
        },
        headers: {
          Authorization: `JWT ${token}`,
        },
      });

      setCards([...cards, data]);
    } catch (err) {}
  };

  const updateCard = async (draggableId, destination) => {
    try {
      const data = await request({
        method: 'patch',
        url: `/cards/${draggableId}/`,
        data: {
          row: destination.droppableId,
          seq_num: destination.index,
        },
        headers: {
          Authorization: `JWT ${token}`,
        },
      });

      setCards(
        cards.map((item) =>
          item.id == draggableId
            ? {
                ...item,
                row: destination.droppableId,
                seq_num: destination.index,
              }
            : item
        )
      );
    } catch (err) {}
  };

  const deleteCard = async (id) => {
    try {
      await request({
        method: 'delete',
        url: `/cards/${id}/`,
        headers: {
          Authorization: `JWT ${token}`,
        },
      });

      setCards(cards.filter((item) => item.id != id));
    } catch (err) {}
  };

  return {
    cards,
    setCards,
    deleteCard,
    updateCard,
    addCard,
    token,
    tokenReady,
    isTokenExpired,
    createAccount,
    login,
    logout,
    loading,
  };
};
