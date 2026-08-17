import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import { useSelector } from "react-redux";
import Button from "../../components/common/Button";

import MainLayout from "../../layouts/MainLayout";
import taskService from "../../services/taskService";
import ConfirmationModal from "../../components/common/ConfirmationModal";
console.log(taskService);

export default function TaskDetails() {

    const { taskId } = useParams();
    const navigate = useNavigate();

    const { user } = useSelector((state) => state.auth);

    const [task, setTask] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const [showDeleteModal, setShowDeleteModal] = useState(false);

    useEffect(() => {

        const fetchTask = async () => {

            try {

                const data = await taskService.getTaskById(taskId);
                setTask(data);

            } catch {

                setError("Failed to load task.");

            } finally {

                setLoading(false);

            }

        };

        fetchTask();

    }, [taskId]);


    const handleDelete = async () => {

        try {

            await taskService.deleteTask(taskId);

            navigate("/tasks");

        } 
        catch (err) {

            console.log(err);
            console.log(err.response);
            console.log(err.response?.data);

            setError(
                err.response?.data?.message ||
                "Failed to delete task."
            );

        }

    };

    return (
        <MainLayout>

            <h1 className="text-3xl font-bold mb-6">
                Task Details
            </h1>

            {loading && (
                <p>Loading task...</p>
            )}

            {!loading && error && (
                <p className="text-red-600">{error}</p>
            )}

            {!loading && !error && task && (
                <div className="bg-white rounded-xl shadow-md p-8 border">

                    <div className="flex justify-between items-start mb-6">

                        <div>
                            <h2 className="text-3xl font-bold">
                                {task.title}
                            </h2>

                            <p className="text-gray-500 mt-2">
                                Task #{task.taskNumber}
                            </p>
                        </div>

                        <div className="flex gap-3">

                            <span
                                className={`
                                    px-4 py-1 rounded-full text-sm font-semibold
                                    ${
                                        task.status === "COMPLETED"
                                            ? "bg-green-100 text-green-700"
                                            : task.status === "IN_PROGRESS"
                                            ? "bg-yellow-100 text-yellow-700"
                                            : "bg-gray-100 text-gray-700"
                                    }
                                `}
                            >
                                {task.status.replace("_", " ")}
                            </span>

                            <span
                                className={`
                                    px-4 py-1 rounded-full text-sm font-semibold
                                    ${
                                        task.priority === "HIGH"
                                            ? "bg-red-100 text-red-700"
                                            : task.priority === "MEDIUM"
                                            ? "bg-orange-100 text-orange-700"
                                            : "bg-blue-100 text-blue-700"
                                    }
                                `}
                            >
                                {task.priority}
                            </span>

                            {(user?.role === "OWNER" || user?.role === "MANAGER") && (

                                <>
                                    <Button
                                        onClick={() => navigate(`/tasks/${task.id}/edit`)}
                                        className="bg-blue-600 hover:bg-blue-700"
                                    >
                                        Edit
                                    </Button>

                                    <Button
                                        onClick={() => setShowDeleteModal(true)}
                                        className="bg-red-600 hover:bg-red-700"
                                    >
                                        Delete
                                    </Button>
                                </>

                            )}

                        </div>

                    </div>

                    <hr className="my-6" />

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                        <div>
                            <p className="text-gray-500 text-sm">
                                Assigned To
                            </p>

                            <p className="font-semibold text-lg">
                                {task.assignedToName}
                            </p>
                        </div>

                        <div>
                            <p className="text-gray-500 text-sm">
                                Assigned By
                            </p>

                            <p className="font-semibold text-lg">
                                {task.assignedByName}
                            </p>
                        </div>

                        <div>
                            <p className="text-gray-500 text-sm">
                                Due Date
                            </p>

                            <p className="font-semibold">
                                {new Date(task.dueDate).toLocaleString()}
                            </p>
                        </div>

                        <div>
                            <p className="text-gray-500 text-sm">
                                Created At
                            </p>

                            <p className="font-semibold">
                                {new Date(task.createdAt).toLocaleString()}
                            </p>
                        </div>

                    </div>

                    <hr className="my-6" />

                    <div>

                        <h3 className="text-xl font-semibold mb-3">
                            Description
                        </h3>

                        <p className="text-gray-700 whitespace-pre-line leading-7">
                            {task.description || "No description provided."}
                        </p>

                    </div>

                </div>
            )}

            <ConfirmationModal
                isOpen={showDeleteModal}
                title="Delete Task"
                message="Are you sure you want to permanently delete this task? This action cannot be undone."
                confirmText="Delete"
                cancelText="Cancel"
                onConfirm={handleDelete}
                onCancel={() => setShowDeleteModal(false)}
            />

        </MainLayout>
    );
}