import axios, { AxiosError } from 'axios';
import { parseCookies, setCookie } from 'nookies';

//miragejs
export const api = axios.create({
  baseURL: 'http://localhost:3000/api',
});

let cookies = parseCookies();

//nodejs auth api
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

        authApi
          .post('/refresh', {
            refreshToken,
          }).then(({ data }) => {
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
          });
      } else {
        // deslogar usuário
      }
    }
  }
);
