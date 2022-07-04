import axios from 'axios';

// TODO: add https for production
const baseURL =
  process.env.NODE_ENV === 'development' ? 'http://localhost:5000' : '';

export default axios.create({
  baseURL,
  headers: {
    'Access-Control-Allow-Origin': '*',
    'Content-Type': 'application/json',
    'Access-Control-Allow-Methods': 'GET,PUT,POST,DELETE,OPTIONS',
  },
});
