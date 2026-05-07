import api from ".";
export const fetchAllAlerts = async (params) => {
	try {
		const { data } = await api.get(`/api/alert`, { params: params });
		return data;
	} catch (error) {
		throw error;
	}
};

export const fetchAlertInformation = async (id) => {
	try {
		const { data } = await api.get(`/api/alert/${id}`);
		return data;
	} catch (error) {
		throw error;
	}
};

export const fetchStats = async () => {
	try {
		const { data } = await api.get(`/api/alert/alert-stats`);
		return data;
	} catch (error) {
		throw error;
	}
};
