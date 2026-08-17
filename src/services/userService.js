import axiosInstance from "../redux/api/axios";

const getCurrentUser = async () => {

    const response = await axiosInstance.get(
        "/users/me"
    );

    return response.data;
};

const assignManager = async (userId) => {

    const response = await axiosInstance.put(
        `/users/${userId}/manager`
    );

    return response.data;
};


const userService = {
    getCurrentUser,
    assignManager,
};


export default userService;