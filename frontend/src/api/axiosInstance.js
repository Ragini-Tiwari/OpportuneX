import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:5000/api/v1",
  withCredentials: true, // send cookies
});

api.interceptors.response.use(
  (res) => res,
  (err) => {
    // central error handling
    if (err.response?.status === 401) {
      // handle unauthorized globally
      console.log("Unauthorized, redirect to login");
    }
    return Promise.reject(err);
  }
);

export default api;
