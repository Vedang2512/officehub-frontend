import axios from "../redux/api/axios";

const notificationService = {

    getNotifications: async () => {

        const response = await axios.get("/notifications");

        return response.data;
    },

    getUnreadCount: async () => {

        const response = await axios.get(
            "/notifications/unread-count"
        );

        return response.data;
    },

    markAsRead: async (notificationId) => {

        await axios.put(
            `/notifications/${notificationId}/read`
        );
    }

};

export default notificationService;