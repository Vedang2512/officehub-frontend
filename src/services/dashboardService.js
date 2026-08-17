import axiosInstance from "../redux/api/axios";

const getOwnerDashboard = async () => {
  const response = await axiosInstance.get(
    "/dashboard/owner"
  );

  return response.data;
};


const getManagerDashboard = async () => {
  const response = await axiosInstance.get(
    "/dashboard/manager"
  );

  return response.data;
};


const getEmployeeDashboard = async () => {
  const response = await axiosInstance.get(
    "/dashboard/employee"
  );

  return response.data;
};

const getTaskStatusAnalytics = async () => {
  const response = await axiosInstance.get(
    "/dashboard/analytics/task-status"
  );

  return response.data;
};


const dashboardService = {
  getOwnerDashboard,
  getManagerDashboard,
  getEmployeeDashboard,
  getTaskStatusAnalytics,
};


export default dashboardService;