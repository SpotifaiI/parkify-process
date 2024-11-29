import axios from 'axios';

export const presentation = axios.create({
  baseURL: process.env.APP_PRESENTATION_ENDPOINT,
});