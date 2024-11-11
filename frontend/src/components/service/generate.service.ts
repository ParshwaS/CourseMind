import axios from "axios";

const API_URL = "http://localhost:5000/api/genQuiz/";

class GenerateService {
	async generate(content: any, number: any, subject: any, level: any) {
		if (localStorage.getItem("user") === null) {
			return null;
		}
		const token = JSON.parse(
			localStorage.getItem("user") as string
		).accessToken;
		return axios
			.post(API_URL + "genQuiz", {
				"text": content,
				"number": number,
				"subject": subject,
				"level": level,
			}, {
				headers: { Authorization: `Bearer ${token}` },
			})
			.then((response) => {
				return response.data;
			});
	}
}

export default new GenerateService();
