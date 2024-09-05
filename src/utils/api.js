// src/utils/api.js
import axios from 'axios';

const instance = axios.create({
  baseURL: 'http://localhost:3001', // Assuming JSON Server is running on this port
});

export default instance;
