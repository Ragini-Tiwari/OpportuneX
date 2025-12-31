import api from "../utils/api";

export const authService = {
    register: async (userData) => {
        const response = await api.post("/auth/register", userData);
        return response.data;
    },

    login: async (credentials) => {
        const response = await api.post("/auth/login", credentials);
        return response.data;
    },

    logout: async () => {
        const response = await api.post("/auth/logout");
        return response.data;
    },

    getMe: async () => {
        const response = await api.get("/auth/me");
        return response.data;
    },
};

export const jobService = {
    getAllJobs: async (params) => {
        const response = await api.get("/jobs", { params });
        return response.data;
    },

    getJob: async (id) => {
        const response = await api.get(`/jobs/${id}`);
        return response.data;
    },

    createJob: async (jobData) => {
        const response = await api.post("/jobs", jobData);
        return response.data;
    },

    updateJob: async (id, jobData) => {
        const response = await api.put(`/jobs/${id}`, jobData);
        return response.data;
    },

    deleteJob: async (id) => {
        const response = await api.delete(`/jobs/${id}`);
        return response.data;
    },

    getMyJobs: async () => {
        const response = await api.get("/jobs/my/jobs");
        return response.data;
    },

    getSavedJobs: async () => {
        const response = await api.get("/jobs/saved/all");
        return response.data;
    },

    toggleSaveJob: async (id) => {
        const response = await api.post(`/jobs/${id}/save`);
        return response.data;
    },
};

export const adminService = {
    getStats: async () => {
        const response = await api.get("/admin/stats");
        return response.data;
    },

    getUsers: async () => {
        const response = await api.get("/admin/users");
        return response.data;
    },

    deleteUser: async (id) => {
        const response = await api.delete(`/admin/users/${id}`);
        return response.data;
    },

    getJobs: async () => {
        const response = await api.get("/admin/jobs");
        return response.data;
    },
};

export const applicationService = {
    createApplication: async (applicationData) => {
        const response = await api.post("/applications", applicationData);
        return response.data;
    },

    getMyApplications: async () => {
        const response = await api.get("/applications/my");
        return response.data;
    },

    getJobApplications: async (jobId) => {
        const response = await api.get(`/applications/job/${jobId}`);
        return response.data;
    },

    updateApplicationStatus: async (id, status, notes) => {
        const response = await api.put(`/applications/${id}/status`, {
            status,
            notes,
        });
        return response.data;
    },

    deleteApplication: async (id) => {
        const response = await api.delete(`/applications/${id}`);
        return response.data;
    },
};
