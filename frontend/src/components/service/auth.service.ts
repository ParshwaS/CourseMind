import axios from "axios";

const API_URL = "http://localhost:5000/api/auth/";

class AuthService {
	async login(email: string, password: string) {
		return axios
			.post(API_URL + "login", {
				email,
				password,
			})
			.then((response) => {
				if (response.data.accessToken) {
					localStorage.setItem("user", JSON.stringify(response.data));
				}
				return response.data;
			});
	}

	logout() {
		localStorage.removeItem("user");
	}

	async register(name: string, email: string, password: string) {
		return axios.post(API_URL + "register", {
			name,
			email,
			password,
		}).then((response) => {
			return response.data;
		});
	}

	getCurrentUser() {
		const userStr = localStorage.getItem("user");
		if (userStr) return JSON.parse(userStr);
		return null;
	}
}

export default new AuthService();
