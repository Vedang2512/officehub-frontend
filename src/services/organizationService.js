import axiosInstance from "../redux/api/axios";

const createOrganization = async (organizationData) => {

    const response = await axiosInstance.post(
        "/organizations",
        organizationData
    );

    return response.data;
};

const getMyOrganization = async () => {

    const response = await axiosInstance.get(
        "/organizations/me"
    );

    return response.data;
};

const leaveOrganization = async () => {

    const response = await axiosInstance.delete(
        "/organizations/leave"
    );

    return response.data;
};

const getOrganizationMembers = async () => {

    const response = await axiosInstance.get(
        "/organizations/members"
    );

    return response.data;
};

const updateOrganization = async (organizationData) => {

    const response = await axiosInstance.put(
        "/organizations",
        organizationData
    );

    return response.data;
};

const deleteOrganization = async () => {

    const response = await axiosInstance.delete(
        "/organizations"
    );

    return response.data;
};

const organizationService = {
    createOrganization,
    getMyOrganization,
    leaveOrganization,
    getOrganizationMembers,
    updateOrganization,
    deleteOrganization,
};

export default organizationService;