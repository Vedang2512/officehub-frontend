import {
    PieChart,
    Pie,
    Cell,
    Tooltip,
    Legend,
    ResponsiveContainer
} from "recharts";

const COLORS = [
    "#3B82F6",
    "#F59E0B",
    "#22C55E"
];

export default function TaskStatusChart({ dashboardData }) {

    if (!dashboardData) {
        return null;
    }

    const data = [
        {
            name: "Pending",
            value: dashboardData.pendingTasks
        },
        {
            name: "In Progress",
            value: dashboardData.inProgressTasks
        },
        {
            name: "Completed",
            value: dashboardData.completedTasks
        }
    ];

    const hasData = data.some(item => item.value > 0);

    return (
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">

            <div className="mb-5 border-b pb-3">
                <h2 className="text-xl font-semibold text-gray-800">
                    Task Status Distribution
                </h2>

                <p className="text-sm text-gray-500 mt-1">
                    Overview of all organization tasks
                </p>
            </div>

            <div className="h-80">

                {!hasData ? (

                    <div className="flex items-center justify-center h-full">

                        <div className="text-center">
                            <div className="text-5xl mb-3">📊</div>

                            <p className="font-medium text-gray-700">
                                No analytics available
                            </p>

                            <p className="text-sm text-gray-500 mt-2">
                                Create a few tasks to see your dashboard insights.
                            </p>
                        </div>

                    </div>

                ) : (

                    <ResponsiveContainer width="100%" height="100%">

                        <PieChart>

                            <Pie
                                data={data}
                                dataKey="value"
                                nameKey="name"
                                cx="50%"
                                cy="45%"
                                innerRadius={55}
                                outerRadius={90}
                                paddingAngle={4}
                                label={false}
                            >

                                {data.map((entry, index) => (

                                    <Cell
                                        key={index}
                                        fill={COLORS[index]}
                                    />

                                ))}

                            </Pie>

                            <Tooltip
                                formatter={(value) => [`${value} Tasks`, "Count"]}
                            />

                            <Legend
                                verticalAlign="bottom"
                                align="center"
                                iconType="circle"
                                wrapperStyle={{
                                    paddingTop: "20px"
                                }}
                            />

                        </PieChart>

                    </ResponsiveContainer>

                )}

            </div>

        </div>
    );

}