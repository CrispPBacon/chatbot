import axios from "axios";

const backendUrl = `${import.meta.env.VITE_BACKEND_HOST}:${
  import.meta.env.VITE_BACKEND_PORT
}`;

// const prodURL = import.meta.env.VITE_BACKEND_HOST
//   ? import.meta.env.VITE_BACKEND_HOST
//   : "https://chatbot-8z3s.onrender.com";
const prodURL = import.meta.env.VITE_BACKEND_HOST
  ? import.meta.env.VITE_BACKEND_HOST
  : "http://localhost:3000";
console.log(prodURL, prodURL === "http://localhost" ? backendUrl : prodURL);
const api = axios.create({
  baseURL: prodURL === "http://localhost" ? backendUrl : prodURL,
});

export default api;
