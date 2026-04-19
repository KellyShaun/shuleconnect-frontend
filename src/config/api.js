// frontend/src/config/api.js
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

console.log('API_BASE_URL:', API_BASE_URL); // Debug log

export default API_BASE_URL;