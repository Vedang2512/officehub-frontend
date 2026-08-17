import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import MainLayout from "../../layouts/MainLayout";
import taskService from "../../services/taskService";
import employeeService from "../../services/employeeService";
import teamService from "../../services/teamService";

import TaskForm from "../../components/tasks/TaskForm";
import Loader from "../../components/common/Loader";

export default function EditTask() {

    const { taskId } = useParams();
    const navigate = useNavigate();

    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState("");

    const [employees, setEmployees] = useState([]);
    const [teams, setTeams] = useState([]);

    const [formData, setFormData] = useState({
        title: "",
        description: "",
        priority: "MEDIUM",
        status: "TODO",
        assignedToUserId: "",
        teamId: "",
        dueDate: ""
    });

    useEffect(() => {

    const loadData = async () => {

            try {

                const [task, employeeData, teamData] = await Promise.all([
                    taskService.getTaskById(taskId),
                    employeeService.getEmployees(),
                    teamService.getTeams()
                ]);

                setEmployees(employeeData);
                setTeams(teamData);

                setFormData({
                    title: task.title,
                    description: task.description,
                    priority: task.priority,
                    status: task.status,
                    assignedToUserId: task.assignedToUserId,
                    teamId: task.teamId ?? "",
                    dueDate: task.dueDate
                        ? task.dueDate.substring(0, 16)
                        : ""
                });

            } catch (err) {

                setError(
                    err.response?.data?.message ||
                    "Failed to load task."
                );

            } finally {

                setLoading(false);

            }

        };

        loadData();

    }, [taskId]);

    const handleChange = (e) => {

        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });

    };

    const handleSubmit = async (e) => {

        e.preventDefault();

        try {

            setSaving(true);
            setError("");

            await taskService.updateTask(
                taskId,
                formData
            );

            navigate(`/tasks/${taskId}`);

        } catch (err) {

            setError(
                err.response?.data?.message ||
                "Failed to update task."
            );

        } finally {

            setSaving(false);

        }

    };



    return (
        <MainLayout>

            <h1 className="text-3xl font-bold mb-6">
                Edit Task
            </h1>

            {loading && <Loader />}

            {!loading && (

                <TaskForm
                    formData={formData}
                    handleChange={handleChange}
                    handleSubmit={handleSubmit}
                    employees={employees}
                    teams={teams}
                    loading={saving}
                    error={error}
                    submitLabel="Save Changes"
                    showStatus={true}
                    onCancel={() => navigate(`/tasks/${taskId}`)}
                />

            )}

        </MainLayout>
    );
}