import axiosInstance from "../redux/api/axios";

const getTeams = async () => {
    const response = await axiosInstance.get("/teams");
    return response.data;
};

const createTeam = async (teamData) => {
    const response = await axiosInstance.post(
        "/teams",
        teamData
    );

    return response.data;
};

const updateTeam = async (teamId, teamData) => {
    const response = await axiosInstance.put(
        `/teams/${teamId}`,
        teamData
    );

    return response.data;
};

const deleteTeam = async (teamId) => {
    const response = await axiosInstance.delete(
        `/teams/${teamId}`
    );

    return response.data;
};

const assignManager = async (teamId, managerId) => {
    const response = await axiosInstance.put(
        `/teams/${teamId}/manager/${managerId}`
    );

    return response.data;
};

const assignEmployeeToTeam = async (teamId, employeeId) => {
    const response = await axiosInstance.post(
        `/teams/${teamId}/members/${employeeId}`
    );

    return response.data;
};

const removeEmployeeFromTeam = async (teamId, employeeId) => {
    const response = await axiosInstance.delete(
        `/teams/${teamId}/members/${employeeId}`
    );

    return response.data;
};

const getTeamMembers = async (teamId) => {
    const response = await axiosInstance.get(
        `/teams/${teamId}/members`
    );

    return response.data;
};

const teamService = {
    getTeams,
    createTeam,
    updateTeam,
    deleteTeam,
    assignManager,
    assignEmployeeToTeam,
    removeEmployeeFromTeam,
    getTeamMembers,
};

export default teamService;