import { useState } from "react";
import { useNavigate } from "react-router-dom";
import MainLayout from "../../layouts/MainLayout";
import teamService from "../../services/teamService";
import Button from "../../components/common/Button";

export default function CreateTeam() {

    const navigate = useNavigate();

    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);


    const handleSubmit = async (e) => {

        e.preventDefault();

        try {

            setLoading(true);
            setError("");

            await teamService.createTeam({
                name,
                description
            });

            navigate("/tasks/create");

        } catch (err) {

            setError(
                err.response?.data?.message ||
                "Failed to create team."
            );

        } finally {

            setLoading(false);

        }
    };


    return (
        <MainLayout>

            <h1 className="text-3xl font-bold mb-6">
                Create Team
            </h1>


            <form
                onSubmit={handleSubmit}
                className="bg-white shadow rounded-lg p-6 max-w-xl space-y-4"
            >

                <input
                    type="text"
                    placeholder="Team Name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full border rounded p-2"
                    required
                />


                <textarea
                    placeholder="Team Description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="w-full border rounded p-2"
                />


                {error && (
                    <p className="text-red-600">
                        {error}
                    </p>
                )}


                <Button
                    type="submit"
                    disabled={loading}
                >
                    {loading ? "Creating..." : "Create Team"}
                </Button>


            </form>

        </MainLayout>
    );
}