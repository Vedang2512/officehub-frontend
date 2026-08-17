import api from "../redux/api/axios";


const getProfile = async () => {

    const response = await api.get(
        "/users/profile"
    );

    return response.data;
};


const updateProfile = async (data) => {

    const response = await api.put(
        "/users/profile",
        data
    );

    return response.data;
};


const changePassword = async (data) => {

    const response = await api.put(
        "/users/profile/password",
        data
    );

    return response.data;
};

const uploadImage = async (formData) => {

    const response = await api.post(
        "/users/profile/image",
        formData
    );

    return response.data;
};

const getNotificationPreferences = async () => {

    const response = await api.get(
        "/users/profile/notifications"
    );

    return response.data;
};

const updateNotificationPreferences = async (data) => {

    const response = await api.put(
        "/users/profile/notifications",
        data
    );

    return response.data;
};

const deleteAccount = async () => {

    const response = await api.delete(
        "/users/account"
    );

    return response.data;
};




export default {
    getProfile,
    updateProfile,
    changePassword,
    uploadImage,
    getNotificationPreferences,
    updateNotificationPreferences,
    deleteAccount
};