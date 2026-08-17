import api from "../redux/api/axios";

const BASE_URL = "/chat";

const chatService = {

    async getConversation(userId) {

        const response = await api.get(
            `${BASE_URL}/${userId}`
        );

        return response.data;
    },


    async sendMessage(receiverId, content) {

        const response = await api.post(
            `${BASE_URL}/send`,
            {
                receiverId,
                content
            }
        );

        return response.data;
    },


    async markAsRead(senderId) {

        await api.put(
            `${BASE_URL}/read/${senderId}`
        );
    },


    async getUnreadCounts() {

        const response = await api.get(
            `${BASE_URL}/unread-counts`
        );

        return response.data;
    },


    async editMessage(messageId, content) {

        const response = await api.put(
            `${BASE_URL}/edit/${messageId}`,
            {
                content
            }
        );

        return response.data;
    },


    async deleteMessage(messageId) {

        const response = await api.delete(
            `${BASE_URL}/${messageId}`
        );

        return response.data;
    }

};

export default chatService;