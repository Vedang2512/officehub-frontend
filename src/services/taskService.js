import axiosInstance from "../redux/api/axios";

const taskService = {

    getMyTasks: async () => {
        const response = await axiosInstance.get("/tasks/my");
        return response.data;
    },

    getOrganizationTasks: async () => {
        const response = await axiosInstance.get("/tasks/organization");
        return response.data;
    },

    getTaskById: async (taskId) => {
        const response = await axiosInstance.get(`/tasks/${taskId}`);
        return response.data;
    },

    createTask: async (taskData) => {
        const response = await axiosInstance.post("/tasks", taskData);
        return response.data;
    },

    updateTask: async (taskId, taskData) => {
        const response = await axiosInstance.put(
            `/tasks/${taskId}`,
            taskData
        );

        return response.data;
    },
    
    deleteTask: async (taskId) => {
        await axiosInstance.delete(`/tasks/${taskId}`);
    },
    
    updateTaskStatus: async (taskId, statusData) => {
        const response = await axiosInstance.put(
            `/tasks/${taskId}/status`,
            statusData
        );

        return response.data;
    },



};

export default taskService;