import axios from "axios";

const API_URL = "http://localhost:3000/api/materials/";

class MaterialService {

    async uploadFile(file: File, courseId: string, moduleId: string) {

        const formData = new FormData();

        formData.append('file', file); // Attach the file
        formData.append('courseId', courseId); // Include the course ID
        formData.append('moduleId', moduleId); // Include the module ID

        if (localStorage.getItem("user") === null) {
			return null;
		}
		const token = JSON.parse(
			localStorage.getItem("user") as string
		).accessToken;
    
        try {
          const response = await axios.post(`${API_URL}upload`, formData, {
            headers: {Authorization: `Bearer ${token}`,},
          });
          return response.data;
        } catch (error) {
          console.error('Error uploading file:', error);
          throw error;
        }
      }

}

export default new MaterialService();