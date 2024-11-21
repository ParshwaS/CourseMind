import axios from "axios";

const API_URL = "http://localhost:3000/api/quizzes/";

class QuizService {

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

    async saveQuiz (generatedQuiz: JSON, topic: string, level: string, moduleId: string) {

        if (localStorage.getItem("user") === null) { return null; }
        const token = JSON.parse(localStorage.getItem("user") as string).accessToken;      

        try {
            const response = await axios.post(`${API_URL}saveQuiz?moduleId=${moduleId}`, {generatedQuiz, topic, level},
              {headers: { Authorization: `Bearer ${token}`},}
            );

            return response.data


        } catch(error) {
          console.error("Error saving Quiz:", error);
          return null;
        }
    }
    
}

export default new QuizService();