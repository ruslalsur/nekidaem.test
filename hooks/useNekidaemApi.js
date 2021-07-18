import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import jwt from 'jsonwebtoken';
import axios from 'axios';
import { API_BASE_URL } from '../constants';

export const useNekidaemApi = () => {
  const router = useRouter();
  const [token, setToken] = useState(null);
  const [tokenReady, setTokenReady] = useState(false);
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

  const request = async (config) => {
    setLoading(true);

    try {
      const { data } = await axios(config);

      setLoading(false);
      return data;
    } catch (err) {
      setLoading(false);
      console.log(`error: `, err);
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

      setToken(data.token || null);
      localStorage.setItem('token', data.token || null);
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
      localStorage.setItem('token', data.token || null);
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
      localStorage.setItem('token', data.token || null);
    } catch (err) {
      console.log(`refresh token error: `, err);
    }
  };

  const isTokenExpired = () => {
    if (!token) return true;
    const { exp } = jwt.decode(token);

    return exp < Date.now() / 1000;
  };

  const isTokenRefreshNeeded = () => {
    if (!token) return false;

    const { exp } = jwt.decode(token);
    const currentTime = Date.now() / 1000;
    const refreshThreshold = exp * 0.7;

    return currentTime < refreshThreshold;
  };

  return {
    token,
    tokenReady,
    isTokenExpired,
    createAccount,
    login,
    logout,
    loading,
  };
};
