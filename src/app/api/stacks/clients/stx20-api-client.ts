import axios from 'axios';

export function stx20ApiClient() {
  return axios.create({
    baseURL: 'https://api.stx20.com/api/v1',
  });
}
