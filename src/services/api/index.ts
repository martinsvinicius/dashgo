import axios from 'axios';

//miragejs
export const api = axios.create({
  baseURL: 'http://localhost:3000/api',
});

//nodejs api
export const authApi = axios.create({
  baseURL: 'http://localhost:3333',
});
