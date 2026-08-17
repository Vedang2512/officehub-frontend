
import { useSelector, useDispatch } from "react-redux";
import notificationService from "../../services/notificationService";
import { markAsRead } from "../../redux/notification/notificationSlice";
import EmptyState from "../common/EmptyState";

export default function NotificationDropdown() {

    const dispatch = useDispatch();

    const notifications = useSelector(
        (state) => state.notification.notifications
    );

    const handleClick = async (notification) => {

        if (!notification.read) {

            try {

                await notificationService.markAsRead(notification.id);

                dispatch(markAsRead(notification.id));

            } catch (error) {

                console.error(
                    "Failed to mark notification as read",
                    error
                );

            }

        }

    };

    return (

        <div
            className="
                absolute
                right-0
                mt-2
                w-96
                bg-white
                rounded-xl
                shadow-xl
                border
                z-50
                overflow-hidden
            "
        >

            {/* Header - stays fixed */}
            <div
                className="
                    p-4
                    border-b
                    bg-gray-50
                    text-gray-900
                    font-bold
                    text-lg
                "
            >
                🔔 Notifications
            </div>


            {/* Scrollable notification list */}
            <div
                className="
                    max-h-[300px]
                    overflow-y-auto
                "
            >

                {notifications.length === 0 ? (

                    <div className="p-5">

                        <EmptyState
                            icon="🔔"
                            title="No Notifications"
                            description="You're all caught up. New notifications will appear here."
                        />

                    </div>

                ) : (

                    notifications.map((notification) => (

                        <button
                            key={notification.id}
                            onClick={() =>
                                handleClick(notification)
                            }
                            className={`
                                w-full
                                text-left
                                p-4
                                border-b
                                transition-all
                                duration-200
                                hover:bg-gray-100
                                ${
                                    !notification.read
                                        ? "bg-blue-50 border-l-4 border-l-blue-600"
                                        : "bg-white"
                                }
                            `}
                        >

                            <div
                                className={`
                                    font-semibold
                                    text-gray-900
                                    leading-6
                                    ${
                                        !notification.read
                                            ? "text-gray-900"
                                            : "text-gray-700"
                                    }
                                `}
                            >
                                {notification.message}
                            </div>


                            <div className="text-xs text-gray-600 mt-2">

                                {new Date(
                                    notification.createdAt
                                ).toLocaleString()}

                            </div>

                        </button>

                    ))

                )}

            </div>

        </div>

    );

}

