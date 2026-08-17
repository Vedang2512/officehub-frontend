import axiosInstance from "../redux/api/axios";



const getEmployees = async () => {

    const response = await axiosInstance.get(
        "/employees"
    );

    return response.data;
};



const inviteEmployee = async (employeeData) => {

    const response = await axiosInstance.post(
        "/employees/invite",
        employeeData
    );

    return response.data;
};



const removeEmployee = async (employeeId) => {

    const response = await axiosInstance.delete(
        `/employees/${employeeId}`
    );

    return response.data;
};

const acceptInvitation = async (invitationId) => {

    const response = await axiosInstance.post(
        `/employees/invitation/${invitationId}/accept`
    );

    return response.data;
};


const rejectInvitation = async (invitationId) => {

    const response = await axiosInstance.post(
        `/employees/invitation/${invitationId}/reject`
    );

    return response.data;
};

const getPendingInvitation = async () => {

    const response = await axiosInstance.get(
        "/employees/invitation"
    );

    return response.data;
};


const employeeService = {
    getEmployees,
    inviteEmployee,
    removeEmployee,
    acceptInvitation,
    rejectInvitation,
    getPendingInvitation,
};




export default employeeService;