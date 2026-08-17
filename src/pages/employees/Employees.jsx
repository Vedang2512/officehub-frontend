import { useEffect, useState } from "react";

import MainLayout from "../../layouts/MainLayout";
import employeeService from "../../services/employeeService";
import { useSelector } from "react-redux";
import EmptyState from "../../components/common/EmptyState";

export default function Employees() {

    const [employees, setEmployees] = useState([]);

    const [email, setEmail] = useState("");

    const [message, setMessage] = useState("");
    const [error, setError] = useState("");


    useEffect(() => {

        let cancelled = false;

        const fetchEmployees = async () => {

            try {

                const data =
                    await employeeService.getEmployees();

                if (!cancelled) {
                    setEmployees(data);
                }

            } catch {

                if (!cancelled) {
                    setError(
                        "Failed to load employees"
                    );
                }

            }

        };

        fetchEmployees();

        return () => {
            cancelled = true;
        };

    }, []);




    const handleInvite = async (e) => {

        e.preventDefault();

        try {

            await employeeService.inviteEmployee({
                email
            });


            setMessage(
                "Invitation sent successfully"
            );

            setEmail("");

        } catch (err) {

            setError(
                err.response?.data?.message ||
                "Invitation failed"
            );

        }

    };

    const { user } = useSelector(
        (state) => state.auth
    );

    const canManageEmployees =
        user?.role === "OWNER" ||
        user?.role === "MANAGER";



    return (
        <MainLayout>

            <h1 className="text-3xl font-bold mb-6">
                Employees
            </h1>


            {canManageEmployees && (
            <form
                onSubmit={handleInvite}
                className="mb-6 flex gap-3"
            >

                <input
                    type="email"
                    placeholder="Employee email"
                    value={email}
                    onChange={(e)=>
                        setEmail(e.target.value)
                    }
                    className="border p-3 rounded"
                />


                <button
                    className="bg-blue-600 text-white px-5 rounded"
                >
                    Invite
                </button>

            </form>)}



            {message && (
                <p className="text-green-600">
                    {message}
                </p>
            )}


            {error && (
                <p className="text-red-600">
                    {error}
                </p>
            )}



            <div>

                <h2 className="text-xl font-bold mb-3">
                    Members
                </h2>


                {
                    employees.length === 0 ? (

                        <EmptyState

                            icon="👥"

                            title="No Employees Found"

                            description="Your organization does not have any employees yet."

                            actionLabel={
                                canManageEmployees
                                ? "Invite Employee"
                                : null
                            }

                            onAction={
                                canManageEmployees
                                ? () =>
                                    document
                                    .querySelector("input[type='email']")
                                    ?.focus()
                                : null
                            }

                        />

                    ) : (

                        employees.map((employee)=>(

                            <div
                                key={employee.id}
                                className="
                                    border
                                    p-3
                                    mb-2
                                    rounded-lg
                                    bg-white
                                "
                            >

                                {employee.fullName}
                                {" - "}
                                {employee.email}

                            </div>

                        ))

                    )
                }


            </div>


        </MainLayout>
    );
}