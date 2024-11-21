import axios from "axios";

const API_URL = "http://localhost:3000/api/modules/";

class ModuleService {

	async getByCourseId(courseId: string) {
		if (localStorage.getItem("user") === null) {
			return null;
		}
		const token = JSON.parse(
			localStorage.getItem("user") as string
		).accessToken;
		
		try {
			const response = await axios.get(`${API_URL}getByCourseId?courseId=${courseId}`,
				{headers: { Authorization: `Bearer ${token}`},}
			);
		  return response.data;
		} catch (error) {
		  console.error("Error fetching Modules data:", error);
		  return null;
		}
	}

	async getById(id: any) {
		if (localStorage.getItem("user") === null) {
			return null;
		}
		const token = JSON.parse(
			localStorage.getItem("user") as string
		).accessToken;
		return axios
			.get(API_URL + "getbyId?id="+id, {
				headers: { Authorization: `Bearer ${token}` },
			})
			.then((response) => {
				return response.data;
			});
	}

	async create(name: string, courseId: string) {
		if (localStorage.getItem("user") === null) {
			return null;
		}
		const token = JSON.parse(localStorage.getItem("user") as string).accessToken;

		const createdModule = await axios.post(API_URL + "create", { name, courseId }, { headers: { Authorization: `Bearer ${token}` },});
		
		return createdModule.data;
	}

	async delete(id: string) {
		if (localStorage.getItem("user") === null) {
			return null;
		}
		
		const token = JSON.parse(localStorage.getItem("user") as string).accessToken;
		
		return axios
			.delete(API_URL + `${id}`,
				{
					headers: { Authorization: `Bearer ${token}` },
				}
			)
			.then((response) => {
				return response.data;
			});
	}
}

export default new ModuleService();