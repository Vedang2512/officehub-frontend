export default function RecentTasks({ dashboardData }) {

    if (!dashboardData) {
        return null;
    }

    const recentTasks = dashboardData.recentTasks || [];

    const getStatusColor = (status) => {

        switch (status) {
            case "COMPLETED":
                return "bg-green-100 text-green-700";

            case "IN_PROGRESS":
                return "bg-blue-100 text-blue-700";

            default:
                return "bg-yellow-100 text-yellow-700";
        }

    };

    const getPriorityColor = (priority) => {

        switch (priority) {
            case "HIGH":
                return "bg-red-100 text-red-700";

            case "MEDIUM":
                return "bg-orange-100 text-orange-700";

            default:
                return "bg-gray-100 text-gray-700";
        }

    };

    return (

        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">

            <div className="mb-5 border-b pb-3">

                <h2 className="text-xl font-semibold text-gray-800">
                    Recent Tasks
                </h2>

                <p className="text-sm text-gray-500 mt-1">
                    Latest tasks created in your organization
                </p>

            </div>

            {recentTasks.length === 0 ? (

                <div className="py-10 text-center text-gray-500">
                    No recent tasks found.
                </div>

            ) : (

                <div className="space-y-4">

                    {recentTasks.map(task => (

                        <div
                            key={task.id}
                            className="border rounded-xl p-4 hover:bg-gray-50 transition"
                        >

                            <div className="flex justify-between items-start">

                                <div>

                                    <h3 className="font-semibold text-gray-800">
                                        {task.title}
                                    </h3>

                                    <p className="text-sm text-gray-500 mt-1">
                                        Assigned to {task.assignedTo}
                                    </p>

                                </div>

                                <div className="flex gap-2">

                                    <span
                                        className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(task.priority)}`}
                                    >
                                        {task.priority}
                                    </span>

                                    <span
                                        className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(task.status)}`}
                                    >
                                        {task.status.replace("_", " ")}
                                    </span>

                                </div>

                            </div>

                        </div>

                    ))}

                </div>

            )}

        </div>

    );

}