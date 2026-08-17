import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    notifications: [],
    unreadCount: 0
};

const notificationSlice = createSlice({
    name: "notification",

    initialState,

    reducers: {

        setNotifications(state, action) {
            state.notifications = action.payload;
        },

        addNotification(state, action) {

            state.notifications.unshift(action.payload);

            if (!action.payload.read) {
                state.unreadCount++;
            }
        },

        setUnreadCount(state, action) {
            state.unreadCount = action.payload;
        },

        markAsRead(state, action) {

            const notification = state.notifications.find(
                n => n.id === action.payload
            );

            if (notification && !notification.read) {
                notification.read = true;

                if (state.unreadCount > 0) {
                    state.unreadCount--;
                }
            }
        },

        clearNotifications(state) {
            state.notifications = [];
            state.unreadCount = 0;
        }

    }

});

export const {
    setNotifications,
    addNotification,
    setUnreadCount,
    markAsRead,
    clearNotifications
} = notificationSlice.actions;

export default notificationSlice.reducer;