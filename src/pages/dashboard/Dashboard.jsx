
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import TaskStatusChart from "../../components/dashboard/TaskStatusChart";
import EmployeePerformanceChart from "../../components/dashboard/EmployeePerformanceChart";
import QuickActions from "../../components/dashboard/QuickActions";
import RecentTasks from "../../components/dashboard/RecentTasks";
import MainLayout from "../../layouts/MainLayout";
import dashboardService from "../../services/dashboardService";
import SkeletonLoader from "../../components/common/SkeletonLoader";
import DashboardStatCard from "../../components/dashboard/DashboardStatCard";

export default function Dashboard() {

    const [dashboardData, setDashboardData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const { user } = useSelector(
        (state) => state.auth
    );


    useEffect(() => {

        const fetchDashboard = async () => {
            setLoading(true);
            try {

                let data;

                if (user?.role === "OWNER") {

                    data = await dashboardService.getOwnerDashboard();

                    

                } else if (user?.role === "MANAGER") {

                    data = await dashboardService.getManagerDashboard();

                } else if (user?.role === "EMPLOYEE") {

                    data = await dashboardService.getEmployeeDashboard();

                }

                setDashboardData(data);
                setLoading(false);

            } catch (err) {
                setLoading(false);
                setError(
                    err.response?.data?.message ||
                    "Failed to load dashboard"
                );

            }

        };


        if (user) {
            fetchDashboard();
        }

    }, [user]);



    return (
        <MainLayout>

            <div className="
                p-4
                md:p-6
                max-w-[1600px]
                mx-auto
            ">

                <h1 className="
                    text-2xl
                    md:text-3xl
                    font-bold
                    text-gray-800
                ">
                    Dashboard
                </h1>

                <p className="
                    text-gray-500
                    mt-1
                ">
                    Overview of your workspace activity
                </p>


                {
                    error && (
                        <div className="
                            mt-6
                            bg-red-100
                            text-red-700
                            px-4
                            py-3
                            rounded-xl
                        ">
                            {error}
                        </div>
                    )
                }

                {loading && (

                    <div className="
                        mt-6
                        grid
                        grid-cols-1
                        sm:grid-cols-2
                        lg:grid-cols-3
                        xl:grid-cols-5
                        gap-5
                    ">

                        {Array.from({ length: 5 }).map((_, index) => (

                            <SkeletonLoader
                                key={index}
                                type="card"
                            />

                        ))}

                    </div>

                )}

                {/* OWNER DASHBOARD */}

                {!loading && dashboardData && user?.role === "OWNER" && (

                    <>
                        <div className="
                            grid
                            grid-cols-1
                            sm:grid-cols-2
                            lg:grid-cols-3
                            xl:grid-cols-6
                            gap-4
                            mt-6
                        ">

                            <DashboardStatCard
                                title="Total Employees"
                                value={dashboardData.totalEmployees}
                                icon="👥"
                                accent="blue"
                            />

                            <DashboardStatCard
                                title="Total Managers"
                                value={dashboardData.totalManagers}
                                icon="👔"
                                accent="purple"
                            />

                            <DashboardStatCard
                                title="Total Tasks"
                                value={dashboardData.totalTasks}
                                icon="📋"
                                accent="purple"
                            />

                            <DashboardStatCard
                                title="Pending Tasks"
                                value={dashboardData.pendingTasks}
                                icon="⏳"
                                accent="yellow"
                            />

                            <DashboardStatCard
                                title="In Progress"
                                value={dashboardData.inProgressTasks}
                                icon="🚀"
                                accent="blue"
                            />

                            <DashboardStatCard
                                title="Completed"
                                value={dashboardData.completedTasks}
                                icon="✅"
                                accent="green"
                            />

                        </div>

                        <div className="mt-6">

                            <QuickActions />

                        </div>

                        <div className="
                            grid
                            grid-cols-1
                            lg:grid-cols-1
                            2xl:grid-cols-2
                            gap-6
                            mt-6
                        ">

                            <TaskStatusChart
                                dashboardData={dashboardData}
                            />

                            <EmployeePerformanceChart
                                dashboardData={dashboardData}
                            />

                        </div>

                        <div className="mt-6">

                            <RecentTasks
                                dashboardData={dashboardData}
                            />

                        </div>

                    </>

                )}
            </div>


            {/* EMPLOYEE DASHBOARD */}

            {!loading && dashboardData && user?.role === "EMPLOYEE" && (

                <div className="
                    grid
                    grid-cols-1
                    sm:grid-cols-2
                    lg:grid-cols-4
                    gap-6
                    mt-6
                ">

                    <DashboardStatCard
                        title="Assigned Tasks"
                        value={dashboardData.assignedTasks}
                        icon="📋"
                        accent="blue"
                    />

                    <DashboardStatCard
                        title="Completed Tasks"
                        value={dashboardData.completedTasks}
                        icon="✅"
                        accent="green"
                    />

                    <DashboardStatCard
                        title="Pending Tasks"
                        value={dashboardData.pendingTasks}
                        icon="⏳"
                        accent="yellow"
                    />

                    <DashboardStatCard
                        title="Progress"
                        value={`${dashboardData.progressPercentage}%`}
                        icon="📈"
                        accent="purple"
                    />

                </div>

            )}

            
            {/* MANAGER DASHBOARD */}

            {!loading && dashboardData && user?.role === "MANAGER" && (

                <div className="
                    grid
                    grid-cols-1
                    sm:grid-cols-2
                    lg:grid-cols-4
                    gap-6
                    mt-6
                ">

                    <DashboardStatCard
                        title="Assigned Tasks"
                        value={dashboardData.assignedTasks}
                        icon="📋"
                        accent="blue"
                    />

                    <DashboardStatCard
                        title="Completed Tasks"
                        value={dashboardData.completedTasks}
                        icon="✅"
                        accent="green"
                    />

                    <DashboardStatCard
                        title="Pending Tasks"
                        value={dashboardData.pendingTasks}
                        icon="⏳"
                        accent="yellow"
                    />

                    <DashboardStatCard
                        title="In Progress"
                        value={dashboardData.inProgressTasks}
                        icon="🚀"
                        accent="purple"
                    />

                </div>

            )}




        </MainLayout>
    );
}

