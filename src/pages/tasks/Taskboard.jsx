import { useEffect, useState, useMemo, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import MainLayout from "../../layouts/MainLayout";
import taskService from "../../services/taskService";
import EmptyState from "../../components/common/EmptyState";
import websocketService from "../../services/websocketService";

import TaskCard from "../../components/tasks/TaskCard";
import Toast from "../../components/common/Toast";
import TaskCardSkeleton from "../../components/common/TaskCardSkeleton";

export default function TaskBoard() {

    const { user } = useSelector((state) => state.auth);
    const navigate = useNavigate();
    const [tasks, setTasks] = useState([]);
   

    const [statusFilter, setStatusFilter] = useState("ALL");
    const [priorityFilter, setPriorityFilter] = useState("ALL");
    const [assigneeFilter, setAssigneeFilter] = useState("ALL");
    const [searchTerm, setSearchTerm] = useState("");

    const [sortBy, setSortBy] = useState("TASK_NUMBER");

    const TASKS_PER_PAGE = 8;

    const [currentPage, setCurrentPage] = useState(1);

    const [loading, setLoading] = useState(true);

    const [toast, setToast] = useState({
        message: "",
        type: "success"
    });

    const fetchTasks = useCallback(async () => {

        try {

            let data;

            if (user?.role === "EMPLOYEE") {
                data = await taskService.getMyTasks();
            } else {
                data = await taskService.getOrganizationTasks();
            }

            const taskList = Array.isArray(data)
                ? data
                : [];

            setTasks(taskList);
            

        } catch (err) {

            setToast({
                message:
                    err.response?.data?.message ||
                    "Failed to load tasks.",
                type: "error"
            });

            } finally {

            setLoading(false);

        }

    }, [user]);


    useEffect(() => {

        if (user) {
            // eslint-disable-next-line react-hooks/set-state-in-effect
            fetchTasks();
        }

    }, [user, fetchTasks]);




    const filteredTasks = useMemo(() => {

        let filtered = [...tasks];

        if (statusFilter !== "ALL") {

            filtered = filtered.filter(
                task => task.status === statusFilter
            );

        }

        if (priorityFilter !== "ALL") {

            filtered = filtered.filter(
                task => task.priority === priorityFilter
            );

        }

        if (assigneeFilter !== "ALL") {

            filtered = filtered.filter(
                task =>
                    String(task.assignedToUserId) === assigneeFilter
            );

        }

        if (searchTerm.trim() !== "") {

            filtered = filtered.filter(task =>
                task.title
                    .toLowerCase()
                    .includes(searchTerm.toLowerCase())
            );

        }

        switch (sortBy) {

            case "TASK_NUMBER":
                filtered.sort(
                    (a, b) =>
                        (a.taskNumber || 0) -
                        (b.taskNumber || 0)
                );
                break;

            case "NEWEST":
                filtered.sort(
                    (a, b) =>
                        new Date(b.createdAt) -
                        new Date(a.createdAt)
                );
                break;

            case "OLDEST":
                filtered.sort(
                    (a, b) =>
                        new Date(a.createdAt) -
                        new Date(b.createdAt)
                );
                break;

            case "DUE_DATE":
                filtered.sort(
                    (a, b) =>
                        new Date(a.dueDate) -
                        new Date(b.dueDate)
                );
                break;

            case "PRIORITY": {
                const priorityOrder = {
                    HIGH: 3,
                    MEDIUM: 2,
                    LOW: 1
                };

                filtered.sort(
                    (a, b) =>
                        priorityOrder[b.priority] -
                        priorityOrder[a.priority]
                );

                break;
            }

            default:
                break;
        }

        return filtered;

    }, [
        tasks,
        statusFilter,
        priorityFilter,
        assigneeFilter,
        searchTerm,
        sortBy
    ]);

    


    useEffect(() => {

        if (
            !user ||
            !websocketService.isConnected() ||
            !user.organizationId
        ) {
            return;
        }

        const subscription = websocketService.subscribe(

            `/topic/organization/${user.organizationId}/tasks`,

            async (event) => {

                console.log("Task Event:", event);

                switch (event.eventType) {

                    case "CREATED":
                    case "UPDATED":
                    case "DELETED":
                    case "STATUS_CHANGED":

                        await fetchTasks();
                        break;

                    default:
                        break;
                }

            }

        );

        return () => {

            subscription?.unsubscribe();

        };

    }, [user, fetchTasks]);

    const handleStatusUpdate = async(taskId, status)=>{

        try {

            await taskService.updateTaskStatus(
                taskId,
                {status}
            );


            const updated =
                await taskService.getMyTasks();


            setTasks(updated);
            

            setToast({
                message: "Task status updated successfully.",
                type: "success"
            });


        } catch(err){

            setToast({
                message:
                    err.response?.data?.message ||
                    "Failed to update task.",
                type: "error"
            });

        }

    };

    const startIndex =
        (currentPage - 1) * TASKS_PER_PAGE;

    const currentTasks =
        filteredTasks.slice(
            startIndex,
            startIndex + TASKS_PER_PAGE
        );


    return (

        <MainLayout>

            <Toast
                message={toast.message}
                type={toast.type}
                onClose={() =>
                    setToast({
                        message:"",
                        type:"success"
                    })
                }
            />


            <div className="flex flex-col lg:flex-row lg:justify-between lg:items-center gap-5 mb-6">


                <h1 className="text-3xl font-bold">
                    {
                        user?.role === "EMPLOYEE"
                        ? "My Tasks"
                        : "Organization Tasks"
                    }
                </h1>



                <div className="flex flex-wrap items-center gap-3">

                    <input
                        type="text"
                        placeholder="Search tasks..."
                        value={searchTerm}
                        onChange={(e) => {
                            setSearchTerm(e.target.value);
                            setCurrentPage(1);
                        }}
                        className="
                            min-w-[260px]
                            rounded-lg
                            border
                            border-gray-300
                            px-4
                            py-2
                            outline-none
                            focus:border-blue-500
                            focus:ring-2
                            focus:ring-blue-200
                        "
                    />

                    <select
                        value={statusFilter}
                        onChange={(e) => {
                            setStatusFilter(e.target.value);
                            setCurrentPage(1);
                        }}
                        className="
                            rounded-lg
                            border
                            border-gray-300
                            px-4
                            py-2
                            bg-white
                            focus:border-blue-500
                            focus:ring-2
                            focus:ring-blue-200
                        "
                    >
                        <option value="ALL">All Status</option>
                        <option value="TODO">TODO</option>
                        <option value="IN_PROGRESS">IN PROGRESS</option>
                        <option value="COMPLETED">COMPLETED</option>
                    </select>

                    <select
                        value={priorityFilter}
                        onChange={(e) => {
                            setPriorityFilter(e.target.value);
                            setCurrentPage(1);
                        }}
                        className="
                            rounded-lg
                            border
                            border-gray-300
                            px-4
                            py-2
                            bg-white
                            focus:border-blue-500
                            focus:ring-2
                            focus:ring-blue-200
                        "
                    >
                        <option value="ALL">All Priority</option>
                        <option value="HIGH">HIGH</option>
                        <option value="MEDIUM">MEDIUM</option>
                        <option value="LOW">LOW</option>
                    </select>

                    <select
                        value={assigneeFilter}
                        onChange={(e) => {
                            setAssigneeFilter(e.target.value);
                            setCurrentPage(1);
                        }}
                        className="
                            rounded-lg
                            border
                            border-gray-300
                            px-4
                            py-2
                            bg-white
                            focus:border-blue-500
                            focus:ring-2
                            focus:ring-blue-200
                        "
                    >
                        <option value="ALL">All Assignees</option>

                        {[...new Map(
                            tasks.map(task => [
                                task.assignedToUserId,
                                task.assignedToName
                            ])
                        )].map(([id, name]) => (

                            <option key={id} value={id}>
                                {name}
                            </option>

                        ))}

                    </select>

                    <select
                        value={sortBy}
                        onChange={(e) => {
                            setSortBy(e.target.value);
                            setCurrentPage(1);
                        }}
                        className="
                            rounded-lg
                            border
                            border-gray-300
                            px-4
                            py-2
                            bg-white
                            focus:border-blue-500
                            focus:ring-2
                            focus:ring-blue-200
                        "
                    >
                        <option value="TASK_NUMBER">Task Number</option>
                        <option value="NEWEST">Newest</option>
                        <option value="OLDEST">Oldest</option>
                        <option value="DUE_DATE">Due Date</option>
                        <option value="PRIORITY">Priority</option>
                    </select>

                </div>


            </div>





            {loading && (

                <div className="grid grid-cols-1 gap-6">

                    {Array.from({ length: 6 }).map((_, index) => (

                        <TaskCardSkeleton
                            key={index}
                        />

                    ))}

                </div>

            )}


            {!loading &&
                filteredTasks.length === 0 && (

                    <EmptyState

                        icon="📋"

                        title="No Tasks Found"

                        description="There are no tasks matching your current filters."

                        actionLabel={
                            (user?.role === "OWNER" || user?.role === "MANAGER")
                            ? "Create New Task"
                            : null
                        }

                        onAction={
                            (user?.role === "OWNER" || user?.role === "MANAGER")
                            ? () => navigate("/tasks/create")
                            : null
                        }

                    />

                )}




            <div className="grid gap-5">

                {currentTasks.map(task => (

                    <TaskCard
                        key={task.id}
                        task={task}
                        user={user}
                        onStatusUpdate={handleStatusUpdate}
                    />

                ))}

            </div>

        </MainLayout>

    );

}