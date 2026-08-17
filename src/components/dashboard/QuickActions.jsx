import { Link } from "react-router-dom";

const actions = [
    {
        title: "Create Task",
        description: "Assign a new task",
        icon: "➕",
        to: "/tasks/create",
        color: "bg-blue-200"
    },
    {
        title: "Invite Employee",
        description: "Add a new team member",
        icon: "👥",
        to: "/employees",
        color: "bg-green-200"
    },
    {
        title: "Organization",
        description: "View organization details",
        icon: "🏢",
        to: "/organization",
        color: "bg-purple-200"
    },
    {
        title: "Task Board",
        description: "Manage all tasks",
        icon: "📋",
        to: "/tasks",
        color: "bg-orange-200"
    }
];

export default function QuickActions() {
    return (
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">

            <h2 className="text-xl font-semibold text-gray-800">
                Quick Actions
            </h2>

            <p className="text-sm text-gray-500 mt-1 mb-5">
                Frequently used shortcuts
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">

                {actions.map((action) => (

                    <Link
                        key={action.title}
                        to={action.to}
                        className="
                        group
                        rounded-xl
                        border
                        border-gray-200
                        hover:border-blue-300
                        hover:-translate-y-1
                        hover:shadow-lg
                        transition-all
                        duration-200
                        p-4
                        "
                    >
                        <div
                            className={`${action.color} w-12 h-12 rounded-lg flex items-center justify-center text-2xl text-white`}
                        >
                            {action.icon}
                        </div>

                        <h3 className="mt-4 font-semibold text-gray-800 group-hover:text-blue-600">
                            {action.title}
                        </h3>

                        <p className="text-sm text-gray-500 mt-1">
                            {action.description}
                        </p>
                    </Link>

                ))}

            </div>

        </div>
    );
}