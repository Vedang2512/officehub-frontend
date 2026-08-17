import { useEffect, useState } from "react";
import websocketService from "../../services/websocketService";
import { useSelector } from "react-redux";
import MainLayout from "../../layouts/MainLayout";
import teamService from "../../services/teamService";
import Loader from "../../components/common/Loader";
import ErrorMessage from "../../components/common/ErrorMessage";
import EmptyState from "../../components/common/EmptyState";
import employeeService from "../../services/employeeService";
import userService from "../../services/userService";

export default function Teams() {

    const [teams, setTeams] = useState([]);
    
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [teamName, setTeamName] = useState("");
    const [teamDescription, setTeamDescription] = useState("");
    const [saving, setSaving] = useState(false);
    const [formError, setFormError] = useState("");
    const [editingTeam, setEditingTeam] = useState(null);

    const [viewingTeam, setViewingTeam] = useState(null);
    const [teamMembers, setTeamMembers] = useState([]);
    const [membersLoading, setMembersLoading] = useState(false);
    const [membersError, setMembersError] = useState("");

    const [showAddMember, setShowAddMember] = useState(false);
    const [employees, setEmployees] = useState([]);
    const [selectedEmployee, setSelectedEmployee] = useState("");
    const [employeesLoading, setEmployeesLoading] = useState(false);
    const [memberSaving, setMemberSaving] = useState(false);

    const [managerSaving, setManagerSaving] = useState(false);

    const user = useSelector(
        (state) => state.auth.user
    );



    useEffect(() => {

        const fetchTeams = async () => {

            try {

                const data =
                    await teamService.getTeams();

                setTeams(
                    Array.isArray(data)
                        ? data
                        : []
                );


            } catch(err) {

                setError(
                    err.response?.data?.message ||
                    "Failed to load teams."
                );

            } finally {

                setLoading(false);

            }

        };


        fetchTeams();

    }, []);

    useEffect(() => {

        const organizationId = user?.organizationId;

        if (!organizationId) {
            return;
        }

        const destination =
            `/topic/organization/${organizationId}/teams`;

        const subscribeToTeams = () => {

            websocketService.unsubscribe(destination);

            websocketService.subscribe(
                destination,
                (event) => {

                    console.log(
                        "Team WebSocket event:",
                        event
                    );

                    if (
                        event.eventType === "CREATED" ||
                        event.eventType === "UPDATED" ||
                        event.eventType === "DELETED" ||
                        event.eventType === "MANAGER_ASSIGNED" ||
                        event.eventType === "MEMBER_ADDED" ||
                        event.eventType === "MEMBER_REMOVED"
                    ) {

                        teamService.getTeams()
                            .then((data) => {

                                setTeams(
                                    Array.isArray(data)
                                        ? data
                                        : []
                                );

                            })
                            .catch((error) => {

                                console.error(
                                    "Failed to refresh teams:",
                                    error
                                );

                            });

                    }

                }
            );
        };

        if (websocketService.isConnected()) {

            subscribeToTeams();

        } else {

            websocketService.onConnected(
                subscribeToTeams
            );

        }

        return () => {

            websocketService.unsubscribe(
                destination
            );

        };

    }, [user?.organizationId]);

    const handleCreateTeam = async (e) => {

        e.preventDefault();

        if (!teamName.trim()) {
            setFormError("Team name is required.");
            return;
        }

        try {

            setSaving(true);
            setFormError("");

            const newTeam = await teamService.createTeam({
                name: teamName.trim(),
                description: teamDescription.trim() || null,
            });

            setTeams((prev) => [
                ...prev,
                newTeam
            ]);

            setTeamName("");
            setTeamDescription("");
            setShowCreateModal(false);

        } catch (err) {

            setFormError(
                err.response?.data?.message ||
                "Failed to create team."
            );

        } finally {

            setSaving(false);

        }
    };

    const handleUpdateTeam = async (e) => {

        e.preventDefault();

        if (!teamName.trim()) {
            setFormError("Team name is required.");
            return;
        }

        try {

            setSaving(true);
            setFormError("");

            const updatedTeam = await teamService.updateTeam(
                editingTeam.id,
                {
                    name: teamName.trim(),
                    description: teamDescription.trim() || null,
                }
            );

            setTeams((prev) =>
                prev.map((team) =>
                    team.id === updatedTeam.id
                        ? updatedTeam
                        : team
                )
            );

            setTeamName("");
            setTeamDescription("");
            setEditingTeam(null);

        } catch (err) {

            setFormError(
                err.response?.data?.message ||
                "Failed to update team."
            );

        } finally {

            setSaving(false);

        }
    };

    const handleDeleteTeam = async (teamId) => {

        const confirmed = window.confirm(
            "Are you sure you want to delete this team? All members will be removed from the team."
        );

        if (!confirmed) {
            return;
        }

        try {

            setSaving(true);
            setError("");

            await teamService.deleteTeam(teamId);

            setTeams((prev) =>
                prev.filter((team) => team.id !== teamId)
            );

        } catch (err) {

            setError(
                err.response?.data?.message ||
                "Failed to delete team."
            );

        } finally {

            setSaving(false);

        }
    };

    const handleViewMembers = async (team) => {

        try {

            setViewingTeam(team);
            setTeamMembers([]);
            setMembersError("");
            setMembersLoading(true);

            const members =
                await teamService.getTeamMembers(team.id);

            setTeamMembers(
                Array.isArray(members)
                    ? members
                    : []
            );

        } catch (err) {

            setMembersError(
                err.response?.data?.message ||
                "Failed to load team members."
            );

        } finally {

            setMembersLoading(false);

        }
    };

    const handleOpenAddMember = async () => {

        try {

            setShowAddMember(true);
            setSelectedEmployee("");
            setEmployeesLoading(true);

            const data = await employeeService.getEmployees();

            setEmployees(
                Array.isArray(data)
                    ? data
                    : []
            );

        } catch (err) {

            setMembersError(
                err.response?.data?.message ||
                "Failed to load employees."
            );

        } finally {

            setEmployeesLoading(false);

        }
    };

    const handleAddMember = async () => {

        if (!selectedEmployee) {
            setMembersError("Please select an employee.");
            return;
        }

        try {

            setMemberSaving(true);
            setMembersError("");

            await teamService.assignEmployeeToTeam(
                viewingTeam.id,
                selectedEmployee
            );

            const members =
                await teamService.getTeamMembers(
                    viewingTeam.id
                );

            setTeamMembers(
                Array.isArray(members)
                    ? members
                    : []
            );

            setSelectedEmployee("");
            setShowAddMember(false);

        } catch (err) {

            setMembersError(
                err.response?.data?.message ||
                "Failed to add employee to team."
            );

        } finally {

            setMemberSaving(false);

        }
    };

    const handleRemoveMember = async (employeeId) => {

        const confirmed = window.confirm(
            "Are you sure you want to remove this employee from the team?"
        );

        if (!confirmed) {
            return;
        }

        try {

            setMemberSaving(true);
            setMembersError("");

            await teamService.removeEmployeeFromTeam(
                viewingTeam.id,
                employeeId
            );

            setTeamMembers((prev) =>
                prev.filter(
                    (member) => member.userId !== employeeId
                )
            );

        } catch (err) {

            setMembersError(
                err.response?.data?.message ||
                "Failed to remove employee from team."
            );

        } finally {

            setMemberSaving(false);

        }
    };


    const handleMakeManager = async (userId) => {

        const confirmed = window.confirm(
            "Are you sure you want to make this employee a manager?"
        );

        if (!confirmed) {
            return;
        }

        try {

            setManagerSaving(true);
            setMembersError("");

            await userService.assignManager(userId);

                await teamService.assignManager(
                    viewingTeam.id,
                    userId
                );

                const members =
                    await teamService.getTeamMembers(
                        viewingTeam.id
                    );

            setTeamMembers(
                Array.isArray(members)
                    ? members
                    : []
            );

        } catch (err) {

            setMembersError(
                err.response?.data?.message ||
                "Failed to assign manager."
            );

        } finally {

            setManagerSaving(false);

        }
    };

    return (

        <MainLayout>


            <div className="flex items-center justify-between mb-6">

                <h1 className="text-3xl font-bold">
                    Teams
                </h1>

                {user?.role === "OWNER" && (
                    <button
                        onClick={() => {
                            setFormError("");
                            setShowCreateModal(true);
                        }}
                        className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
                    >
                        + Create Team
                    </button>
                )}

            </div>



            {loading && <Loader />}



            <ErrorMessage message={error} />




            {!loading && teams.length === 0 && (

                <EmptyState

                    icon="👥"

                    title="No Teams Found"

                    description="Your organization does not have any teams yet."

                />

            )}






            <div className="grid md:grid-cols-2 gap-5">


                {teams.map((team)=>(


                    <div

                        key={team.id}

                        className="bg-white shadow rounded-xl p-5"

                    >

                        <div className="h-7 flex justify-end gap-3 mb-1">
                            {user?.role === "OWNER" && (
                                <>
                                    <button
                                        onClick={() => {
                                            setEditingTeam(team);
                                            setTeamName(team.name || "");
                                            setTeamDescription(
                                                team.description || ""
                                            );
                                            setFormError("");
                                        }}
                                        className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                                    >
                                        Edit
                                    </button>

                                    <button
                                        onClick={() =>
                                            handleDeleteTeam(team.id)
                                        }
                                        className="text-red-600 hover:text-red-800 text-sm font-medium"
                                        disabled={saving}
                                    >
                                        Delete
                                    </button>
                                </>
                            )}
                        </div>

                        <h2 className="text-xl font-semibold break-words -mt-8">
                            {team.name}
                        </h2>

                        <p className="text-gray-600 mt-1 break-words">
                            {team.description || "No description"}
                        </p>



                




                        <div className="mt-4 text-sm space-y-1">


                            <p>

                                Manager:

                                <span className="font-semibold ml-1">

                                    {team.managerName ||
                                    "Not Assigned"}

                                </span>

                            </p>




                            {team.createdAt && (

                                <p>

                                    Created:

                                    <span className="font-semibold ml-1">

                                        {
                                        new Date(team.createdAt)
                                        .toLocaleDateString()
                                        }

                                    </span>

                                </p>

                            )}



                        </div>

                        <div className="mt-5">

                            <button
                                onClick={() => handleViewMembers(team)}
                                className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                            >
                                View Members
                            </button>

                        </div>



                    </div>


                ))}


            </div>

            {(showCreateModal || editingTeam) && (

                <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">

                    <div className="bg-white rounded-xl shadow-xl w-full max-w-md p-6">

                        <h2 className="text-2xl font-bold mb-5">
                            {editingTeam ? "Edit Team" : "Create Team"}
                        </h2>

                        <form
                            onSubmit={
                                editingTeam
                                    ? handleUpdateTeam
                                    : handleCreateTeam
                            }
                            className="space-y-4"
                        >

                            <div>

                                <label className="block text-sm font-medium mb-1">
                                    Team Name
                                </label>

                                <input
                                    type="text"
                                    value={teamName}
                                    onChange={(e) =>
                                        setTeamName(e.target.value)
                                    }
                                    placeholder="Enter team name"
                                    className="w-full border rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500"
                                    disabled={saving}
                                />

                            </div>

                            <div>

                                <label className="block text-sm font-medium mb-1">
                                    Description
                                </label>

                                <textarea
                                    value={teamDescription}
                                    onChange={(e) =>
                                        setTeamDescription(e.target.value)
                                    }
                                    placeholder="Enter team description"
                                    rows="3"
                                    className="w-full border rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500"
                                    disabled={saving}
                                />

                            </div>

                            {formError && (
                                <p className="text-red-600 text-sm">
                                    {formError}
                                </p>
                            )}

                            <div className="flex justify-end gap-3 pt-2">

                                <button
                                    type="button"
                                    onClick={() => {
                                        setShowCreateModal(false);
                                        setEditingTeam(null);
                                        setTeamName("");
                                        setTeamDescription("");
                                        setFormError("");
                                    }}
                                    className="px-4 py-2 border rounded-lg hover:bg-gray-100"
                                    disabled={saving}
                                >
                                    Cancel
                                </button>

                                <button
                                    type="submit"
                                    className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50"
                                    disabled={saving}
                                >
                                    {saving
                                        ? editingTeam
                                            ? "Updating..."
                                            : "Creating..."
                                        : editingTeam
                                            ? "Update Team"
                                            : "Create Team"}
                                </button>

                            </div>

                        </form>

                    </div>

                </div>

            )}


            {viewingTeam && (

                <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">

                    <div className="bg-white rounded-xl shadow-xl w-full max-w-md p-6">

                        <div className="flex items-center justify-between mb-5">

                            <div className="flex items-center justify-between mb-5">

                                <h2 className="text-2xl font-bold">
                                    {viewingTeam.name} Members
                                </h2>

                                {user?.role === "OWNER" && (
                                    <button
                                        onClick={handleOpenAddMember}
                                        className="ml-4 bg-blue-600 text-white px-2 py-2 rounded-lg text-sm hover:bg-blue-700"
                                    >
                                        + Add Member
                                    </button>
                                )}

                            </div>

                            <button
                                onClick={() => {
                                    setViewingTeam(null);
                                    setTeamMembers([]);
                                    setMembersError("");
                                }}
                                className="text-gray-500 hover:text-gray-800 text-xl"
                            >
                                ×
                            </button>

                        </div>

                        {membersLoading && (
                            <Loader />
                        )}

                        {membersError && (
                            <ErrorMessage message={membersError} />
                        )}

                        {!membersLoading &&
                            !membersError &&
                            teamMembers.length === 0 && (

                                <p className="text-gray-500 text-center py-6">
                                    No members in this team.
                                </p>

                            )}

                        {!membersLoading &&
                            !membersError &&
                            teamMembers.length > 0 && (

                                <div className="space-y-3">

                                    {teamMembers.map((member) => (

                                        <div
                                            key={member.id}
                                            className="flex items-center justify-between border rounded-lg p-3"
                                        >

                                            <div>

                                                <p className="font-medium">
                                                    {member.fullName}
                                                </p>

                                                <p className="text-sm text-gray-500">
                                                    {member.email}
                                                </p>

                                            </div>

                                            <div className="flex items-center gap-3">

                                                <span className="text-xs font-medium text-gray-600">
                                                    {member.role}
                                                </span>

                                                {user?.role === "OWNER" && member.role === "EMPLOYEE" && (
                                                    <button
                                                        onClick={() =>
                                                            handleMakeManager(member.userId)
                                                        }
                                                        className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                                                        disabled={managerSaving}
                                                    >
                                                        {managerSaving ? "Assigning..." : "Make Manager"}
                                                    </button>
                                                )}

                                                {user?.role === "OWNER" && (
                                                    <button
                                                        onClick={() =>
                                                            handleRemoveMember(member.userId)
                                                        }
                                                        className="text-red-600 hover:text-red-800 text-sm font-medium"
                                                        disabled={memberSaving || managerSaving}
                                                    >
                                                        Remove
                                                    </button>
                                                )}

                                            </div>

                                        </div>

                                    ))}

                                </div>

                            )}

                            {showAddMember && (

                                <div className="mt-5 border-t pt-5">

                                    <h3 className="font-semibold mb-3">
                                        Add Employee
                                    </h3>

                                    {employeesLoading ? (

                                        <Loader />

                                    ) : (

                                        <>

                                            <select
                                                value={selectedEmployee}
                                                onChange={(e) =>
                                                    setSelectedEmployee(e.target.value)
                                                }
                                                className="w-full border rounded-lg px-3 py-2"
                                                disabled={memberSaving}
                                            >

                                                <option value="">
                                                    Select an employee
                                                </option>

                                                {employees
                                                    .filter(
                                                        (employee) =>
                                                            !teamMembers.some(
                                                                (member) =>
                                                                    member.userId === employee.id
                                                            )
                                                    )
                                                    .map((employee) => (

                                                        <option
                                                            key={employee.id}
                                                            value={employee.id}
                                                        >
                                                            {employee.name} — {employee.email}
                                                        </option>

                                                    ))}

                                            </select>

                                            <div className="flex justify-end gap-3 mt-3">

                                                <button
                                                    onClick={() => {
                                                        setShowAddMember(false);
                                                        setSelectedEmployee("");
                                                    }}
                                                    className="px-4 py-2 border rounded-lg hover:bg-gray-100"
                                                    disabled={memberSaving}
                                                >
                                                    Cancel
                                                </button>

                                                <button
                                                    onClick={handleAddMember}
                                                    className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50"
                                                    disabled={
                                                        memberSaving ||
                                                        !selectedEmployee
                                                    }
                                                >
                                                    {memberSaving
                                                        ? "Adding..."
                                                        : "Add Member"}
                                                </button>

                                            </div>

                                        </>

                                    )}

                                </div>

                            )}

                        <div className="flex justify-end mt-5">

                            <button
                                onClick={() => {
                                    setViewingTeam(null);
                                    setTeamMembers([]);
                                    setMembersError("");
                                }}
                                className="px-4 py-2 border rounded-lg hover:bg-gray-100"
                            >
                                Close
                            </button>

                        </div>

                    </div>

                </div>

            )}



        </MainLayout>

    );

}