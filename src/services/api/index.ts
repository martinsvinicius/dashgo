import axios, { AxiosError } from 'axios';
import { parseCookies, setCookie } from 'nookies';
import { signOut } from '../../auth/providers/AuthProvider';

//miragejs
export const api = axios.create({
  baseURL: 'http://localhost:3000/api',
});

//nodejs auth api

let cookies = parseCookies();
let isRefreshing = false;
let failedRequestQueue = [];

export const authApi = axios.create({
  baseURL: 'http://localhost:3333',
  headers: {
    Authorization: `Bearer ${cookies['dashgo.token']}`,
  },
});

authApi.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    if (error.response.status === 401) {
      if (error.response.data?.code === 'token.expired') {
        cookies = parseCookies();

        const { 'dashgo.refreshToken': refreshToken } = cookies;
        const originalConfig = error.config;

        if (!isRefreshing) {
          isRefreshing = true;

          authApi
            .post('/refresh', {
              refreshToken,
            })
            .then(({ data }) => {
              const { token } = data;

              //setting cookies
              setCookie(undefined, 'dashgo.token', token, {
                maxAge: 60 * 60 * 24 * 30, // 30 days
                path: '/',
              });

              setCookie(undefined, 'dashgo.refreshToken', data.refreshToken, {
                maxAge: 60 * 60 * 24 * 30, // 30 days
                path: '/',
              });

              authApi.defaults.headers['Authorization'] = `Bearer ${token}`;

              failedRequestQueue.forEach((request) => request.onSuccess(token));
              failedRequestQueue = [];
            })
            .catch((err) => {
              failedRequestQueue.forEach((request) => request.onFailure(err));
              failedRequestQueue = [];
            })
            .finally(() => {
              isRefreshing = false;
            });
        }

        return new Promise((resolve, reject) => {
          failedRequestQueue.push({
            onSuccess: (token: string) => {
              originalConfig.headers['Authorization'] = `Bearer ${token}`;

              resolve(authApi(originalConfig));
            },
            onFailure: (err: AxiosError) => {
              reject(err);
            },
          });
        });
      } else {
        signOut();
      }
    }

    return Promise.reject(error);
  }
);
