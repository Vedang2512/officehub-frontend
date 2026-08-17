
import employeeService from "../../services/employeeService";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { setUser } from "../../redux/auth/authSlice";
import userService from "../../services/userService";
import { useEffect, useState } from "react";

const EmployeeJoin = () => {

    const [message, setMessage] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [invitation, setInvitation] = useState(null);


    const handleJoin = async () => {

        try {
            setLoading(true);
            setError("");
            setMessage("");

            await employeeService.joinOrganization();

            const updatedUser = await userService.getCurrentUser();

            dispatch(setUser(updatedUser));

            setMessage("Successfully joined organization!");

            setTimeout(() => {
                navigate("/dashboard");
            }, 1000);

        } catch (err) {

            setError(
                err.response?.data?.message ||
                "Failed to join organization"
            );

        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {

        const loadInvitation = async () => {

            try {

                const invitation =
                    await employeeService.getPendingInvitation();

                setInvitation(invitation);

            } catch (err) {

                setError(
                    err.response?.data?.message ||
                    "No pending invitation found."
                );

            }

        };

        loadInvitation();

    }, []);


    return (
        <div className="min-h-screen flex items-center justify-center">

            <div className="bg-white shadow-md rounded-lg p-8 w-96 text-center">

                <h1 className="text-2xl font-bold mb-4">
                    Join Organization
                </h1>

                {invitation ? (
                    <>
                        <p className="text-gray-600 mb-2">
                            You have been invited to join:
                        </p>

                        <h2 className="text-xl font-semibold mb-2">
                            {invitation.organization.organizationName}
                        </h2>

                        <p className="text-gray-500 mb-6">
                            {invitation.organization.description}
                        </p>
                    </>
                ) : (
                    <p className="text-gray-600 mb-6">
                        No pending invitation found.
                    </p>
                )}


                <button
                    onClick={handleJoin}
                    disabled={loading}
                    className="bg-blue-600 text-white px-5 py-2 rounded"
                >
                    {loading ? "Joining..." : "Join Organization"}
                </button>

                


                {message && (
                    <p className="text-green-600 mt-4">
                        {message}
                    </p>
                )}


                {error && (
                    <p className="text-red-600 mt-4">
                        {error}
                    </p>
                )}

            </div>

        </div>
    );
};

export default EmployeeJoin;