import axios from "axios";

const axiosInstance = axios.create({
    baseURL: "https://officehub-backend.onrender.com/api",
});

axiosInstance.interceptors.request.use(
    (config) => {

        const isAuthRequest =
            config.url?.startsWith("/auth/");

        const token =
            localStorage.getItem("token");

        if (token && !isAuthRequest) {
            config.headers.Authorization =
                `Bearer ${token}`;
        }

        return config;
    },
    (error) => Promise.reject(error)
);

export default axiosInstance;