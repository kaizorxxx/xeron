import axios from 'axios';

export const API_KEY = 'ck_3e8e2957bbcf54f27e66048ba5b090aaa8c756107d14f1a66c26b4b5';
export const BASE_URL = 'https://cekno.web.id/api/v1';

export const ceknoApi = axios.create({
  baseURL: BASE_URL,
  headers: {
    'X-API-Key': API_KEY,
    'Content-Type': 'application/json',
  },
});
