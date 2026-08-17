import { useState } from "react";
import { useSelector } from "react-redux";
import { FaBell } from "react-icons/fa";

import NotificationDropdown from "./NotificationDropdown";

export default function NotificationBell() {

    const [open, setOpen] = useState(false);

    const unreadCount = useSelector(
        (state) => state.notification.unreadCount
    );

    return (
        <div className="relative">

            <button
                onClick={() => setOpen(!open)}
                className="relative p-2 rounded-full hover:bg-blue-700 transition"
            >
                <FaBell size={20} />

                {unreadCount > 0 && (
                    <span
                        className="
                            absolute
                            -top-1
                            -right-1
                            bg-red-500
                            text-white
                            text-xs
                            rounded-full
                            min-w-5
                            h-5
                            flex
                            items-center
                            justify-center
                            px-1
                        "
                    >
                        {unreadCount > 99 ? "99+" : unreadCount}
                    </span>
                )}
            </button>

            {open && (
                <NotificationDropdown
                    onClose={() => setOpen(false)}
                />
            )}

        </div>
    );
}