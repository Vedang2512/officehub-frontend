import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import MainLayout from "../../layouts/MainLayout";
import organizationService from "../../services/organizationService";
import employeeService from "../../services/employeeService";

import { setUser } from "../../redux/auth/authSlice";
import userService from "../../services/userService";



export default function Organization() {

    const [organization, setOrganization] = useState(null);

    const [organizationName, setOrganizationName] = useState("");
    const [description, setDescription] = useState("");

    const [message, setMessage] = useState("");
    const [error, setError] = useState("");
    const [leaving, setLeaving] = useState(false);
    const [members, setMembers] = useState([]);
    const [invitation, setInvitation] = useState(null);
    const [joining, setJoining] = useState(false);

    const [editing, setEditing] = useState(false);
    const [saving, setSaving] = useState(false);
    const [editOrganizationName, setEditOrganizationName] = useState("");
    const [editDescription, setEditDescription] = useState("");
    const [deleting, setDeleting] = useState(false);
    

    const { user } = useSelector(
        (state) => state.auth
    );

    const dispatch = useDispatch();

    useEffect(() => {

        const loadOrganization = async () => {

            try {

                const data =
                    await organizationService.getMyOrganization();

                setOrganization(data);

                const memberData =
                    await organizationService.getOrganizationMembers();

                setMembers(memberData);

                setInvitation(null);

            } catch {

                setOrganization(null);
                setMembers([]);

                // User has no organization.
                // Check whether they have a pending invitation.
                if (
                    user?.role === "EMPLOYEE" ||
                    user?.role === "MANAGER"
                ) {

                    try {

                        const pendingInvitation =
                            await employeeService.getPendingInvitation();

                        setInvitation(pendingInvitation);

                    } catch {

                        setInvitation(null);

                    }

                }

            }

        };


        loadOrganization();

    }, [user]);



    const handleSubmit = async (e) => {

        e.preventDefault();

        try {

            const response =
                await organizationService.createOrganization({
                    organizationName,
                    description
                });


            setOrganization(response);

            setMessage(
                "Organization created successfully"
            );

            setError("");

        } catch (err) {

            setError(
                err.response?.data?.message ||
                "Failed to create organization"
            );

            setMessage("");

        }
    };

    const handleLeaveOrganization = async () => {

        const confirmed = window.confirm(
            "Are you sure you want to leave this organization?"
        );

        if (!confirmed) {
            return;
        }

        try {

            setLeaving(true);
            setError("");
            setMessage("");

            await organizationService.leaveOrganization();

            setOrganization(null);

            setMessage(
                "You have left the organization successfully."
            );

        } catch (err) {

            setError(
                err.response?.data?.message ||
                "Failed to leave organization."
            );

        } finally {

            setLeaving(false);

        }
    };

    const handleUpdateOrganization = async (e) => {

        e.preventDefault();

        try {

            setSaving(true);
            setError("");
            setMessage("");

            const updatedOrganization =
                await organizationService.updateOrganization({
                    organizationName: editOrganizationName,
                    description: editDescription
                });

            setOrganization(updatedOrganization);
            setEditing(false);

            setMessage(
                "Organization updated successfully."
            );

        } catch (err) {

            setError(
                err.response?.data?.message ||
                "Failed to update organization."
            );

        } finally {

            setSaving(false);

        }
    };

    const handleDeleteOrganization = async () => {

        const confirmed = window.confirm(
            "Are you sure you want to delete this organization? All members will be removed from the organization and all teams will be deleted. This action cannot be undone."
        );

        if (!confirmed) {
            return;
        }

        try {

            setDeleting(true);
            setError("");
            setMessage("");

            await organizationService.deleteOrganization();

            setOrganization(null);
            setMembers([]);

            setMessage(
                "Organization deleted successfully."
            );

        } catch (err) {

            setError(
                err.response?.data?.message ||
                "Failed to delete organization."
            );

        } finally {

            setDeleting(false);

        }
    };

    const handleAcceptInvitation = async () => {

        try {

            setJoining(true);
            setError("");
            setMessage("");

            await employeeService.acceptInvitation(
                invitation.id
            );

            const updatedUser =
                await userService.getCurrentUser();

            dispatch(setUser(updatedUser));

            setInvitation(null);

            setMessage(
                "You joined the organization successfully."
            );

        } catch (err) {

            setError(
                err.response?.data?.message ||
                "Failed to accept organization invitation."
            );

        } finally {

            setJoining(false);

        }
    };


    const handleRejectInvitation = async () => {

        try {

            setJoining(true);
            setError("");
            setMessage("");

            await employeeService.rejectInvitation(
                invitation.id
            );

            setInvitation(null);

            setMessage(
                "Organization invitation rejected."
            );

        } catch (err) {

            setError(
                err.response?.data?.message ||
                "Failed to reject organization invitation."
            );

        } finally {

            setJoining(false);

        }
    };



    return (
        <MainLayout>

            <h1 className="text-3xl font-bold mb-6">
                Organization
            </h1>
            {message && (
                <p className="mb-4 text-green-600">
                    {message}
                </p>
            )}

            {error && (
                <p className="mb-4 text-red-600">
                    {error}
                </p>
            )}


            {organization ? (

                <>

                    <div className="bg-white p-6 rounded shadow max-w-md">

                        <h2 className="text-xl font-bold">
                            {organization.organizationName}
                        </h2>

                        <p className="mt-2">
                            {organization.description}
                        </p>

                        <p className="mt-2 text-gray-500">
                            Created: {organization.createdAt}
                        </p>

                        {user?.role === "OWNER" && !editing && (

                            <div className="mt-6 flex gap-3">

                                <button
                                    onClick={() => {

                                        setEditOrganizationName(
                                            organization.organizationName
                                        );

                                        setEditDescription(
                                            organization.description || ""
                                        );

                                        setEditing(true);
                                    }}
                                    className="bg-blue-600 text-white px-5 py-3 rounded hover:bg-blue-700"
                                >
                                    Edit Organization
                                </button>

                                <button
                                    onClick={handleDeleteOrganization}
                                    disabled={deleting}
                                    className="bg-red-600 text-white px-5 py-3 rounded hover:bg-red-700 disabled:opacity-50"
                                >
                                    {deleting ? "Deleting..." : "Delete Organization"}
                                </button>

                            </div>

                        )}

                        {user?.role === "OWNER" && editing && (

                            <form
                                onSubmit={handleUpdateOrganization}
                                className="mt-6 space-y-4"
                            >

                                <input
                                    type="text"
                                    value={editOrganizationName}
                                    onChange={(e) =>
                                        setEditOrganizationName(e.target.value)
                                    }
                                    placeholder="Organization name"
                                    className="w-full border p-3 rounded"
                                    required
                                />

                                <textarea
                                    value={editDescription}
                                    onChange={(e) =>
                                        setEditDescription(e.target.value)
                                    }
                                    placeholder="Description"
                                    className="w-full border p-3 rounded"
                                />

                                <div className="flex gap-3">

                                    <button
                                        type="submit"
                                        disabled={saving}
                                        className="bg-green-600 text-white px-5 py-3 rounded hover:bg-green-700 disabled:opacity-50"
                                    >
                                        {saving ? "Saving..." : "Save Changes"}
                                    </button>

                                    <button
                                        type="button"
                                        onClick={() => setEditing(false)}
                                        className="bg-gray-500 text-white px-5 py-3 rounded hover:bg-gray-600"
                                    >
                                        Cancel
                                    </button>

                                </div>

                            </form>

                        )}

                        {(user?.role === "EMPLOYEE" ||
                            user?.role === "MANAGER") && (

                            <button
                                onClick={handleLeaveOrganization}
                                disabled={leaving}
                                className="mt-6 bg-red-600 text-white px-5 py-3 rounded hover:bg-red-700 disabled:opacity-50"
                            >
                                {leaving ? "Leaving..." : "Leave Organization"}
                            </button>

                        )}

                    </div>


                    <div className="bg-white p-6 rounded shadow max-w-2xl mt-6">

                        <h2 className="text-xl font-bold mb-4">
                            Organization Members
                        </h2>

                        <div className="space-y-3">

                            {members.map((member) => (

                                <div
                                    key={member.id}
                                    className="flex items-center justify-between border-b pb-3"
                                >

                                    <div>
                                        <p className="font-semibold">
                                            {member.fullName}
                                        </p>

                                        <p className="text-sm text-gray-500">
                                            {member.email}
                                        </p>

                                        {member.designation && (
                                            <p className="text-sm text-gray-500">
                                                {member.designation}
                                            </p>
                                        )}
                                    </div>

                                    <span className="text-sm font-medium">
                                        {member.role}
                                    </span>

                                </div>

                            ))}

                        </div>

                    </div>

                </>

            ) : user?.role === "OWNER" ? (

                <form
                    onSubmit={handleSubmit}
                    className="space-y-4 max-w-md"
                >

                    <input
                        type="text"
                        placeholder="Organization name"
                        value={organizationName}
                        onChange={(e) =>
                            setOrganizationName(e.target.value)
                        }
                        className="w-full border p-3 rounded"
                    />

                    <textarea
                        placeholder="Description"
                        value={description}
                        onChange={(e) =>
                            setDescription(e.target.value)
                        }
                        className="w-full border p-3 rounded"
                    />

                    <button
                        className="bg-blue-600 text-white px-5 py-3 rounded"
                    >
                        Create Organization
                    </button>

                </form>

            ) : invitation ? (

                <div className="bg-white p-6 rounded shadow max-w-md">

                    <h2 className="text-xl font-bold mb-4">
                        Organization Invitation
                    </h2>

                    <p className="text-gray-600">
                        You have been invited to join:
                    </p>

                    <h3 className="text-xl font-semibold mt-3">
                        {invitation.organizationName}
                    </h3>

                    {invitation.description && (
                        <p className="mt-2 text-gray-600">
                            {invitation.description}
                        </p>
                    )}

                    <div className="mt-6 flex gap-3">

                        <button
                            onClick={handleAcceptInvitation}
                            disabled={joining}
                            className="bg-green-600 text-white px-5 py-3 rounded hover:bg-green-700 disabled:opacity-50"
                        >
                            {joining ? "Processing..." : "Accept Invitation"}
                        </button>

                        <button
                            onClick={handleRejectInvitation}
                            disabled={joining}
                            className="bg-red-600 text-white px-5 py-3 rounded hover:bg-red-700 disabled:opacity-50"
                        >
                            Reject Invitation
                        </button>

                    </div>

                </div>

            ) : (

                <div className="bg-white p-6 rounded shadow max-w-md">

                    <h2 className="text-xl font-bold">
                        No Organization Yet
                    </h2>

                    <p className="mt-3 text-gray-600">
                        You are currently not part of an organization.
                    </p>

                    <p className="mt-2 text-gray-500">
                        Please wait for an organization owner to invite you.
                    </p>

                </div>

            )}

        </MainLayout>
    );
}