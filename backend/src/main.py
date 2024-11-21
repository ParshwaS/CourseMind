import os
import json
from fastapi import FastAPI, HTTPException, Query
from langchain_core.prompts import ChatPromptTemplate
from langchain_ollama.llms import OllamaLLM
from langchain.prompts import PromptTemplate
from langchain.chains import LLMChain
from langchain.chains import SequentialChain

app = FastAPI()

# Initialize the LLM
llm = OllamaLLM(model="qwen2.5:1.5b")

# Templates
QUIZTEMPLATE = """
Text:{filedata}
Additional Text: {text}
You are an expert MCQ maker. Given the above text, it is your job to \
create a quiz of {number} multiple choice questions for {subject} students in {tone} tone. 
Make sure the questions are not repeated and check all the questions to be conforming to the text as well.
Make sure to format your response like RESPONSE_JSON below and use it as a guide. \
Ensure to make {number} MCQs.
### RESPONSE_JSON
{response_json}
"""

EVALTEMPLATE = """
You are an expert English grammarian and writer. Given a Multiple Choice Quiz for {subject} students,\
evaluate the complexity of the questions and provide a complete analysis of the quiz in max 50 words. 
If the quiz does not match the cognitive and analytical abilities of the students,\
update the questions and adjust the tone to perfectly fit the student abilities.
Quiz_MCQs:
{quiz}

Expert Analysis of the above quiz:
"""

RESPONSE_JSON = {
    "1": {
        "mcq": "multiple choice question",
        "options": {
            "a": "choice here",
            "b": "choice here",
            "c": "choice here",
            "d": "choice here",
        },
        "correct": "correct answer",
    },
    "2": {
        "mcq": "multiple choice question",
        "options": {
            "a": "choice here",
            "b": "choice here",
            "c": "choice here",
            "d": "choice here",
        },
        "correct": "correct answer",
    },
    "3": {
        "mcq": "multiple choice question",
        "options": {
            "a": "choice here",
            "b": "choice here",
            "c": "choice here",
            "d": "choice here",
        },
        "correct": "correct answer",
    },
}

# Define prompts
quiz_generate_prompt = PromptTemplate(
    input_variables=["filedata", "text", "number", "subject", "tone", "response_json"],
    template=QUIZTEMPLATE,
)

quiz_eval_prompt = PromptTemplate(
    input_variables=["subject", "quiz"], template=EVALTEMPLATE
)

# Define chains
quiz_chain = LLMChain(llm=llm, prompt=quiz_generate_prompt, output_key="quiz", verbose=True)
review_chain = LLMChain(llm=llm, prompt=quiz_eval_prompt, output_key="review", verbose=True)

generate_eval_chain = SequentialChain(
    chains=[quiz_chain, review_chain],
    input_variables=["filedata", "text", "number", "subject", "tone", "response_json"],
    output_variables=["quiz", "review"],
    verbose=True,
)

# FastAPI route
@app.get("/api/generate")
def get_quiz_questions(
    FILEDATA: str = Query(..., description="The main text file data"),
    TEXT: str = Query(..., description="Additional text input"),
    NUMBER: int = Query(..., description="Number of MCQs"),
    SUBJECT: str = Query(..., description="Target subject"),
    TONE: str = Query(..., description="Tone for the quiz"),
):
    try:
        # Generate the quiz and review
        response = generate_eval_chain(
            {
                "filedata": FILEDATA,
                "text": TEXT,
                "number": NUMBER,
                "subject": SUBJECT,
                "tone": TONE,
                "response_json": json.dumps(RESPONSE_JSON),
            }
        )

        # Extract and clean the quiz response
        quiz = response.get("quiz", "").replace("### RESPONSE_JSON", "").strip()
        if not quiz:
            raise HTTPException(status_code=500, detail="Quiz generation failed")

        # Parse the quiz response into JSON
        try:
            json_block = json.loads(quiz)
        except json.JSONDecodeError as e:
            raise HTTPException(
                status_code=500, detail=f"Quiz parsing error: {str(e)}"
            )

        return json_block

    except Exception as e:
        raise HTTPException(
            status_code=500, detail=f"An error occurred during quiz generation: {str(e)}"
        )