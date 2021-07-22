import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/router';
import jwt from 'jsonwebtoken';
import axios from 'axios';
import { API_BASE_URL } from '../constants';

export const useApi = () => {
  const router = useRouter();
  const [token, setToken] = useState('');
  const [tokenIsReady, setTokenIsReady] = useState(false);
  const [cards, setCards] = useState([]);
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState(null);

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

  const request = useCallback(async (config) => {
    setLoading(true);

    try {
      const { data } = await axios(config);
      setMessages(null);
      setLoading(false);

      return data;
    } catch (error) {
      setLoading(false);
      console.log(`error: `, error);

      if (error.response) {
        const { data, status } = error.response;

        let message = Object.values(data);
        message = Array.isArray(message) ? message.join('\n') : message;

        showMessages({ title: status, text: message });
        console.log(error?.response);
      } else if (error?.request) {
        showMessages({ title: 'Request error', text: error?.request });
        console.log(error?.request);
      } else {
        showMessages({ title: 'Error', text: error });
        console.log('Error', error);
      }
    }
  }, []);

  useEffect(() => {
    setToken(localStorage.getItem('token'));
    if (isTokenExpired()) {
      logout();
    }
    setTokenIsReady(true);
  }, []);

  useEffect(() => {
    const getCards = async () => {
      const data = await request({
        method: 'get',
        url: `/cards/`,
        headers: {
          Authorization: `JWT ${token}`,
        },
      });

      setCards(data);
    };

    token && getCards();
  }, [request, tokenIsReady, token]);

  const showMessages = (msg, duration = 3000) => {
    setMessages(msg);
    setTimeout(() => {
      setMessages(null);
    }, duration);
  };

  const authorize = (accesToken) => {
    setToken(accesToken);
    localStorage.setItem('token', accesToken);
    router.push('/');
  };

  const createAccount = async (username, email, password) => {
    const data = await request({
      method: 'post',
      url: `/users/create/`,
      data: {
        username,
        email,
        password,
      },
    });

    if (!!data.token) {
      authorize(data.token);
    }
  };

  const login = async (username, password) => {
    const data = await request({
      method: 'post',
      url: `/users/login/`,
      data: {
        username,
        password,
      },
    });

    if (!!data.token) {
      authorize(data.token);
    }
  };

  const logout = () => {
    setToken(null);
    localStorage.removeItem('token');
  };

  const isTokenExpired = () => {
    try {
      const { exp } = jwt.decode(token);
      return exp < Date.now() / 1000;
    } catch (error) {
      return false;
    }
  };

  const isTokenRefreshNeeded = (token) => {
    try {
      const { exp } = jwt.decode(token);
      const currentTime = Date.now() / 1000;
      const refreshThreshold = exp * 0.7;

      return currentTime < refreshThreshold;
    } catch (error) {
      return false;
    }
  };

  const refreshToken = async () => {
    try {
      const data = await request({
        method: 'post',
        url: `/users/refresh_token/`,
        data: {
          token,
        },
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!!data) {
        setToken(data.token);
        localStorage.setItem('token', data.token);
      }
    } catch (err) {
      console.log(`refresh token error: `, err);
    }
  };

  const addCard = async (row, text) => {
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
    if (!!data) {
      setCards([...cards, data]);
    }
  };

  const updateCard = async (draggableId, destination) => {
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

    if (!!data) {
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
    }
  };

  const deleteCard = async (id) => {
    const data = await request({
      method: 'delete',
      url: `/cards/${id}/`,
      headers: {
        Authorization: `JWT ${token}`,
      },
    });

    if (typeof data !== undefined) {
      setCards(cards.filter((item) => item.id != id));
    }
  };

  return {
    cards,
    deleteCard,
    updateCard,
    addCard,
    token,
    tokenIsReady,
    isTokenExpired,
    createAccount,
    login,
    logout,
    loading,
    messages,
    showMessages,
  };
};
