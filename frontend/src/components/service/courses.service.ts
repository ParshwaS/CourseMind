import axios from "axios";

const API_URL = "http://localhost:3000/api/courses/";

class AuthService {
	async get() {
		if (localStorage.getItem("user") === null) {
			return null;
		}
		const token = JSON.parse(
			localStorage.getItem("user") as string
		).accessToken;
		return axios
			.get(API_URL + "get", {
				headers: { Authorization: `Bearer ${token}` },
			})
			.then((response) => {
				return response.data;
			});
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

	async create(name: string) {
		if (localStorage.getItem("user") === null) {
			return null;
		}
		const token = JSON.parse(
			localStorage.getItem("user") as string
		).accessToken;
		return axios
			.post(
				API_URL + "create",
				{ name },
				{
					headers: { Authorization: `Bearer ${token}` },
				}
			)
			.then((response) => {
				return response.data;
			});
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

export default new AuthService();
