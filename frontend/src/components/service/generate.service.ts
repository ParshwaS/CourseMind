import axios from "axios";

const API_URL = "http://localhost:3001/api/generate/";

class GenerateService {
	async generate(fileIds: Array<string> = [], content: any, number: number, subject: string, level: string) {

		// if (localStorage.getItem("user") === null) {
		// 	return null;
		// }
		// const token = JSON.parse(
		// 	localStorage.getItem("user") as string
		// ).accessToken;
		// return axios
		// 	.post(API_URL + "genQuiz", {
		// 		"text": content,
		// 		"number": number,
		// 		"subject": subject,
		// 		"level": level,
		// 	}, {
		// 		headers: { Authorization: `Bearer ${token}` },
		// 	})
		// 	.then((response) => {
		// 		return response.data;
		// 	});
	}
}

export default new GenerateService();
