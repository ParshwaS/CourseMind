import axios from "axios";

const API_URL = "http://localhost:3000/api/assignments/";

class AssignmentService {

    async getByModuleId(moduleId: string) {

        if (localStorage.getItem("user") === null) { return null; }
        const token = JSON.parse(localStorage.getItem("user") as string).accessToken;
  
        try {
          const response = await axios.get(`${API_URL}getByModuleId?moduleId=${moduleId}`,
            {headers: { Authorization: `Bearer ${token}`},}
          );
          return response.data;
        } catch (error) {
          console.error("Error fetching Materials data:", error);
          return null;
        }
      };
}

export default new AssignmentService();