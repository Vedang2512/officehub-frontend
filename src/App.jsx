import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

import AppRoutes from "./routes/AppRoutes";
import userService from "./services/userService";
import { setUser } from "./redux/auth/authSlice";
import websocketService from "./services/websocketService";
import {
    setNotifications,
    setUnreadCount,
    addNotification,
} from "./redux/notification/notificationSlice";
import { useRef } from "react";

import notificationService from "./services/notificationService";




function App() {

    const dispatch = useDispatch();

    const { token } = useSelector(
        (state) => state.auth
    );
    const notificationSubscription = useRef(null);


    useEffect(() => {

        const restoreUser = async () => {

            try {

                if (token) {

                    const user =
                        await userService.getCurrentUser();

                    dispatch(setUser(user));

                }

            } catch (error) {

                console.log(
                    "Failed to restore user",
                    error
                );

            }

        };


        restoreUser();

    }, [token, dispatch]);

    useEffect(() => {
        

        if (!token) {

            websocketService.disconnect();
            websocketService.unsubscribe("/user/queue/notifications");
            notificationSubscription.current = null;

            return;
        }

        websocketService.connect(async () => {

            console.log("WebSocket connected");

            try {

                const notifications =
                    await notificationService.getNotifications();

                dispatch(setNotifications(notifications));

                const unread =
                    await notificationService.getUnreadCount();

                dispatch(setUnreadCount(unread));

                websocketService.unsubscribe("/user/queue/notifications");

                notificationSubscription.current =
                    websocketService.subscribe(
                        "/user/queue/notifications",
                        (notification) => {

                            dispatch(addNotification(notification));

                        }
                    );

            } catch (error) {

                console.error(
                    "Failed to initialize notifications",
                    error
                );

            }

        });

        return () => {

           websocketService.unsubscribe("/user/queue/notifications");
            notificationSubscription.current = null;

            

        };

    }, [token, dispatch]);



    return <AppRoutes />;

}

export default App;