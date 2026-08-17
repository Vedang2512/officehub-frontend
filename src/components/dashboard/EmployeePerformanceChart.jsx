import {
    ResponsiveContainer,
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip
} from "recharts";

export default function EmployeePerformanceChart({ dashboardData }) {

    if (!dashboardData) {
        return null;
    }

    const data = dashboardData.employeePerformance || [];

    const hasData = data.length > 0;

    return (

        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">

            <div className="mb-5 border-b pb-3">

                <h2 className="text-xl font-semibold text-gray-800">
                    Team Member Performance
                </h2>

                <p className="text-sm text-gray-500 mt-1">
                    Completed tasks by each team member
                </p>

            </div>

            <div className="h-80">

                {!hasData ? (

                    <div className="flex items-center justify-center h-full">

                        <p className="text-gray-500 text-center">
                            No employee performance data available.
                        </p>

                    </div>

                ) : (

                    <ResponsiveContainer width="100%" height="100%">

                        <BarChart
                            data={data}
                            margin={{
                                top: 10,
                                right: 20,
                                left: 0,
                                bottom: 20
                            }}
                        >

                            <CartesianGrid
                                strokeDasharray="3 3"
                                vertical={false}
                            />

                            <XAxis
                                dataKey="employeeName"
                                tick={{ fontSize: 12 }}
                            />

                            <YAxis
                                allowDecimals={false}
                            />

                            <Tooltip
                                formatter={(value, name) => {

                                    if (name === "completedTasks") {

                                        return [
                                            value,
                                            "Completed Tasks"
                                        ];
                                    }

                                    return value;
                                }

                                }

                                labelFormatter={(label, payload) => {

                                    if (!payload || payload.length === 0) {
                                        return label;
                                    }

                                    const employee = payload[0].payload;

                                    return (
                                        `${employee.employeeName}
Assigned: ${employee.totalAssignedTasks}
Completion: ${employee.completionPercentage.toFixed(1)}%`
                                    );

                                }}

                            />

                            <Bar
                                dataKey="completedTasks"
                                fill="#3B82F6"
                                radius={[8, 8, 0, 0]}
                            />

                        </BarChart>

                    </ResponsiveContainer>

                )}

            </div>

        </div>

    );

}