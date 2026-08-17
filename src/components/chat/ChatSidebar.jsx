
import User from "lucide-react/dist/esm/icons/user";

export default function ChatSidebar({
    employees,
    selectedUser,
    onSelect,
    onlineUsers,
    unreadCounts
}) {

    return (

        <div className="w-80 border-r bg-white overflow-y-auto">

            <div className="p-4 border-b">

                <h2 className="text-xl font-bold">
                    Chats
                </h2>

            </div>

            {

                employees.map((employee) => (

                    <button
                        key={employee.id}
                        onClick={() => onSelect(employee)}
                        className={`
                            w-full
                            flex
                            items-center
                            gap-3
                            p-4
                            hover:bg-gray-100
                            transition

                            ${
                                selectedUser?.id === employee.id
                                    ? "bg-blue-50"
                                    : ""
                            }
                        `}
                    >

                        <div className="relative">

                            <div
                                className="
                                    h-11
                                    w-11
                                    rounded-full
                                    bg-gray-200
                                    flex
                                    items-center
                                    justify-center
                                    overflow-hidden
                                "
                            >
                                {employee.profileImage ? (
                                    <img
                                        src={employee.profileImage}
                                        alt={employee.fullName || employee.name}
                                        className="h-full w-full object-cover"
                                    />
                                ) : (
                                    <User size={20} />
                                )}
                            </div>


                            {
                                onlineUsers.includes(employee.id) && (

                                    <span
                                        className="
                                            absolute
                                            bottom-0
                                            right-0
                                            h-3
                                            w-3
                                            bg-green-500
                                            rounded-full
                                            border-2
                                            border-white
                                        "
                                    />

                                )
                            }

                        </div>


                        <div className="flex-1 text-left min-w-0">

                            <div className="flex items-center justify-between gap-2">

                                <p className="font-semibold truncate">
                                    {employee.name}
                                </p>


                                {
                                    unreadCounts?.[employee.id] > 0 && (

                                        <span
                                            className="
                                                min-w-5
                                                h-5
                                                px-1.5
                                                rounded-full
                                                bg-blue-600
                                                text-white
                                                text-xs
                                                font-semibold
                                                flex
                                                items-center
                                                justify-center
                                            "
                                        >
                                            {
                                                unreadCounts[employee.id] > 99
                                                    ? "99+"
                                                    : unreadCounts[employee.id]
                                            }
                                        </span>

                                    )
                                }

                            </div>


                            <p className="text-sm text-gray-500">
                                {employee.role}
                            </p>

                        </div>

                    </button>

                ))

            }

        </div>

    );

}

