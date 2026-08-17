import { useState, useRef, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { logout } from "../../redux/auth/authSlice";
import NotificationBell from "../notifications/NotificationBell";

import {
    ChevronDown,
    LogOut,
    Settings,
    User
} from "lucide-react";


export default function Navbar({ onMenuClick }) {

    const dispatch = useDispatch();
    

    const { user } = useSelector(
        (state) => state.auth
    );
    
    const navigate = useNavigate();

    const handleLogout = () => {

        dispatch(logout());

        navigate("/login");

    };

    

    const [open, setOpen] = useState(false);

    const dropdownRef = useRef(null);

    useEffect(() => {

        function handleClickOutside(event) {

            if (
                dropdownRef.current &&
                !dropdownRef.current.contains(event.target)
            ) {
                setOpen(false);
            }

        }

        document.addEventListener("mousedown", handleClickOutside);

        return () =>
            document.removeEventListener(
                "mousedown",
                handleClickOutside
            );

    }, []);



    return (

        <header className="
            h-16
            bg-white
            border-b
            border-gray-200
            px-4
            md:px-8
            flex
            items-center
            justify-between
            shadow-sm
        ">

            <button
                onClick={onMenuClick}
                className="
                    md:hidden
                    p-2
                    rounded-lg
                    hover:bg-gray-100
                    text-gray-700
                    transition
                    mr-2
                "
            >
                ☰
            </button>

            {/* Left */}
            <div className="flex items-center">

                <h1 className="
                    text-xl
                    md:text-2xl
                    font-bold
                    text-gray-800
                ">
                    OfficeHub
                </h1>

            </div>

            {/* Right */}
            <div className="
                flex
                items-center
                gap-2
                md:gap-5
            ">

                <NotificationBell />

                {/* Role Badge */}
                {user?.role && (

                    <span className="
                        hidden
                        sm:inline-flex
                        px-3
                        py-1
                        rounded-full
                        bg-blue-100
                        text-blue-700
                        text-sm
                        font-semibold
                    ">

                        {user.role}

                    </span>

                )}

                {/* Profile Dropdown */}
                <div
                    ref={dropdownRef}
                    className="relative"
                >

                    <button
                        onClick={() => setOpen(!open)}
                        className="flex items-center gap-3 hover:bg-gray-100 rounded-xl px-3 py-2 transition"
                    >

                        {user?.profileImage ? (

                            <img
                                src={user.profileImage}
                                alt="Profile"
                                className="w-10 h-10 rounded-full object-cover border"
                            />

                        ) : (

                            <div className="w-10 h-10 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold">

                                {
                                    user?.fullName
                                    ? user.fullName.charAt(0).toUpperCase()
                                    : "U"
                                }

                            </div>

                        )}

                        <div className="text-left">

                            <p className="font-semibold text-gray-800">

                                {user?.fullName}

                            </p>

                            <p className="
                                hidden
                                md:block
                                text-xs
                                text-gray-500
                            ">

                                {user?.email}

                            </p>

                        </div>

                        <ChevronDown
                            size={18}
                            className={`transition-transform ${
                                open ? "rotate-180" : ""
                            }`}
                        />

                    </button>

                    {open && (

                        <div className="absolute right-0 mt-3 w-56 bg-white rounded-xl shadow-xl border overflow-hidden z-50">

                            <button
                                onClick={() => {
                                    navigate("/profile");
                                    setOpen(false);
                                }}
                                className="w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-100"
                            >

                                <User size={18} />

                                Profile

                            </button>

                            <button
                                onClick={() => {
                                    navigate("/settings");
                                    setOpen(false);
                                }}
                                className="w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-100"
                            >

                                <Settings size={18} />

                                Settings

                            </button>

                            <hr />

                            <button
                                onClick={handleLogout}
                                className="w-full flex items-center gap-3 px-4 py-3 text-red-600 hover:bg-red-50"
                            >

                                <LogOut size={18} />

                                Logout

                            </button>

                        </div>

                    )}

                </div>

            </div>

        </header>

        );

}