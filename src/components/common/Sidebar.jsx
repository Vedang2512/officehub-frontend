import { NavLink } from "react-router-dom";
import { useSelector } from "react-redux";

import {
LayoutDashboard,
Building2,
Users,
UsersRound,
ClipboardList,
PlusSquare,
UserCircle,
Settings,
MessageCircle
} from "lucide-react";

export default function Sidebar() {
    const { user } = useSelector((state) => state.auth);

    const menuItems = {
        OWNER: [
            {
                name: "Dashboard",
                path: "/dashboard",
                icon: LayoutDashboard
            },
            {
                name: "Organization",
                path: "/organization",
                icon: Building2
            },
            {
                name: "Employees",
                path: "/employees",
                icon: Users
            },
            {
                name: "Teams",
                path: "/teams",
                icon: UsersRound
            },
            {
                name: "Tasks",
                path: "/tasks",
                icon: ClipboardList
            },
            {
                name: "Create Task",
                path: "/tasks/create",
                icon: PlusSquare
            },

            {
                name: "Chat",
                path: "/chat",
                icon: MessageCircle
            },
            {
                name: "Profile",
                path: "/profile",
                icon: UserCircle
            },
            {
                name: "Settings",
                path: "/settings",
                icon: Settings
            }
        ],

        MANAGER: [
            {
                name: "Dashboard",
                path: "/dashboard",
                icon: LayoutDashboard
            },
            {
                name: "Organization",
                path: "/organization",
                icon: Building2
            },
            {
                name: "Teams",
                path: "/teams",
                icon: UsersRound
            },
            {
                name: "Tasks",
                path: "/tasks",
                icon: ClipboardList
            },
            {
                name: "Create Task",
                path: "/tasks/create",
                icon: PlusSquare
            },
            {
                name: "Chat",
                path: "/chat",
                icon: MessageCircle
            },
            {
                name: "Profile",
                path: "/profile",
                icon: UserCircle
            },
            {
                name: "Settings",
                path: "/settings",
                icon: Settings
            }
        ],

        EMPLOYEE: [
            {
                name: "Dashboard",
                path: "/dashboard",
                icon: LayoutDashboard
            },

            {
                name: "Organization",
                path: "/organization",
                icon: Building2
            },
            {
                name: "My Tasks",
                path: "/tasks",
                icon: ClipboardList
            },
            {
                name: "Teams",
                path: "/teams",
                icon: UsersRound
            },
            {
                name: "Profile",
                path: "/profile",
                icon: UserCircle
            },

            {
                name: "Chat",
                path: "/chat",
                icon: MessageCircle
            },
            {
                name: "Settings",
                path: "/settings",
                icon: Settings
            }
        ]
    };

    const items = menuItems[user?.role] || [];

    return (
        <aside
            className="
                w-72
                min-h-screen
                sticky
                top-0
                bg-slate-900
                text-gray-100
                flex
                flex-col
                border-r
                border-slate-800
            "
        >

            {/* Logo */}
            <div className="px-6 py-8 border-b border-slate-800">

                <h1 className="text-2xl font-bold tracking-wide">
                    OfficeHub
                </h1>

                <p className="text-sm text-gray-400 mt-1">
                    Workspace Management
                </p>

            </div>

            {/* Navigation */}
            <nav className="flex-1 px-4 py-6 space-y-2">

                {items.map((item) => {

                    const Icon = item.icon;

                    return (
                        <NavLink
                            key={item.path}
                            to={item.path}
                            end={item.path === "/tasks"}
                            className={({ isActive }) =>
                                `flex
                                items-center
                                gap-3
                                px-4
                                py-3
                                rounded-xl
                                transition-all
                                duration-200
                                group
                                ${
                                    isActive
                                        ? "bg-blue-600 text-white shadow-lg translate-x-1"
                                        : "text-gray-300 hover:bg-slate-800 hover:text-white hover:translate-x-1"
                                }`
                            }
                        >
                            <Icon 
                                size={20}
                                className="shrink-0"
                            />

                            <span className="font-medium">
                                {item.name}
                            </span>

                        </NavLink>
                    );

                })}

            </nav>

            {/* User Section */}
            <div className="border-t border-slate-800 p-5">

                <div className="flex items-center gap-3">

                    <div className="
                        w-11
                        h-11
                        rounded-full
                        bg-blue-600
                        flex
                        items-center
                        justify-center
                        text-lg
                        font-bold
                        ring-2
                        ring-blue-400/30
                    ">

                        {
                            user?.fullName
                            ? user.fullName.charAt(0).toUpperCase()
                            : "U"
                        }

                    </div>

                    <div className="min-w-0">

                        <p className="
                            font-semibold
                            text-white
                            truncate
                        ">

                            {user?.fullName}

                        </p>

                        <p className="text-xs uppercase tracking-wide text-gray-400">

                            {user?.role}

                        </p>

                    </div>

                </div>

            </div>

        </aside>
    );
}