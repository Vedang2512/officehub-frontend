
import { useNavigate } from "react-router-dom";
import MainLayout from "../../layouts/MainLayout";
import taskService from "../../services/taskService";
import { useEffect, useState } from "react";
import employeeService from "../../services/employeeService";
import teamService from "../../services/teamService";
import TaskForm from "../../components/tasks/TaskForm";

export default function CreateTask() {

    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        title: "",
        description: "",
        priority: "MEDIUM",
        assignedToUserId: "",
        teamId: "",
        dueDate: ""
    });

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const [employees, setEmployees] = useState([]);
    const [teams, setTeams] = useState([]);

    useEffect(() => {

        const loadData = async () => {

            try {

                const employeeData =
                    await employeeService.getEmployees();

                const teamData =
                    await teamService.getTeams();

                setEmployees(employeeData);
                setTeams(teamData);

            } catch {

                setError(
                    "Failed to load employees or teams."
                );

            }
        };


        loadData();

    }, []);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            setLoading(true);
            setError("");

            await taskService.createTask(formData);

            navigate("/tasks");

        } catch (err) {

            setError(
                err.response?.data?.message ||
                "Failed to create task."
            );

        } finally {

            setLoading(false);

        }
    };

    return (
        <MainLayout>

            <h1 className="text-3xl font-bold mb-6">
                Create Task
            </h1>

            <TaskForm
                formData={formData}
                handleChange={handleChange}
                handleSubmit={handleSubmit}
                employees={employees}
                teams={teams}
                loading={loading}
                error={error}
                submitLabel="Create Task"
            />

        </MainLayout>
    );
}