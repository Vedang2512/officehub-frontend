import axiosInstance from "../redux/api/axios";

const login = async (credentials) => {
  const response = await axiosInstance.post("/auth/login", credentials);
  return response.data;
};

const register = async (userData) => {
  const response = await axiosInstance.post("/auth/register", userData);
  return response.data;
};

const authService = {
  login,
  register,
};

export default authService;