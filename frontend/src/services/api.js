import axios from "axios";

const api = axios.create({baseURL: "http://127.0.0.1:8000/api/"});

api.interceptors.request.use((config) => {const accessToken = localStorage.getItem("access");

  if (accessToken) {config.headers.Authorization = `Bearer ${accessToken}`;}

  return config;
});

api.interceptors.response.use((response) => response, async (error) => {const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      const refreshToken = localStorage.getItem("refresh");

      if (!refreshToken) {
        localStorage.removeItem("access");
        localStorage.removeItem("refresh");
        localStorage.removeItem("user");

        window.location.href = "/";
        return Promise.reject(error);
      }

      try {
        const response = await axios.post("http://127.0.0.1:8000/api/accounts/token/refresh/",
          {
            refresh: refreshToken,
          },
        );

        const newAccessToken = response.data.access;

        localStorage.setItem("access", newAccessToken);

        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;

        return api(originalRequest);
      } catch (refreshError) {
        localStorage.removeItem("access");
        localStorage.removeItem("refresh");
        localStorage.removeItem("user");

        window.location.href = "/";

        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  },
);

export default api;
