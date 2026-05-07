import api from ".";
export const fetchAllAlerts = async (params) => {
	try {
		const { data } = await api.get(`/api/alert`, { params: params });
		return data;
	} catch (error) {
		throw error;
	}
};
