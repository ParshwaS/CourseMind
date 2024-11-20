import axios from "axios";
import materialsService from "./materials.service";

const API_URL = "http://localhost:3000/api/generate/";

class GenerateService {

	async generate(fileIds: Array<string> = [], content: any, number: number, subject: string, level: string) {

		// Parase a document and generate clean text
		const filePaths: Array<string> = [];

		for (const fileId of fileIds) {

			try {

				const file = await materialsService.getById(fileId);

				//parse and clean file content

				filePaths.push(file.filePath);

			} catch(error) {
				console.error(`Error processing file with ID ${fileId}:`, error);
			}
		}

		if (localStorage.getItem("user") === null) {
			return null;
		}
		const token = JSON.parse(
			localStorage.getItem("user") as string
		).accessToken;
		return axios
			.post(API_URL + "genQuiz", {
				"filepaths": filePaths,
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
