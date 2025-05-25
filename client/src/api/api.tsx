import axios from "axios";

// const backendUrl = `${import.meta.env.VITE_BACKEND_HOST}:${
//   import.meta.env.VITE_BACKEND_PORT
// }`;

const prodURL = `${import.meta.env.VITE_BACKEND_HOST}`;
const api = axios.create({
  baseURL: prodURL,
});

export default api;
