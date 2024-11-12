import os
import json
import pandas as pd
import traceback
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from langchain_core.prompts import ChatPromptTemplate
from langchain_ollama.llms import OllamaLLM
from langchain.prompts import PromptTemplate
from langchain.chains import LLMChain
from langchain.chains import SequentialChain

app = FastAPI()

template = """Question: {question}

Answer: Let's think step by step."""

prompt = ChatPromptTemplate.from_template(template)

llm = OllamaLLM(model="qwen2.5:3b")

TEMPLATE = """
Text:{text}
You are an expert MCQ maker. Given the above text, it is your job to \
create a quiz of {number} multiple choice questions for {subject} students in {tone} tone. 
Make sure the questions are not repeated and check all the questions to be conforming the text as well.
Make sure to format your response like RESPONSE_JSON below and use it as a guide. \
Ensure to make {number} MCQs
### RESPONSE_JSON
{response_json}
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

TEMPLATE2="""
You are an expert english grammarian and writer. Given a Multiple Choice Quiz for {subject} students.\
You need to evaluate the complexity of the question and give a complete analysis of the quiz. Only use at max 50 words for complexity analysis. 
if the quiz is not at per with the cognitive and analytical abilities of the students,\
update the quiz questions which needs to be changed and change the tone such that it perfectly fits the student abilities
Quiz_MCQs:
{quiz}

Check from an expert English Writer of the above quiz:
"""

quiz_generate_prompt = PromptTemplate(
    input_variables=["text", "number", "subject", "tone", "response_json"],
    template = TEMPLATE
)

quiz_eval_prompt = PromptTemplate(input_variables=["subject", "quiz"], template=TEMPLATE2)

quiz_chain = LLMChain(llm = llm, prompt=quiz_generate_prompt, output_key="quiz", verbose = True)

review_chain = LLMChain(llm = llm, prompt = quiz_generate_prompt, output_key="review", verbose=True)

generate_eval_chain = SequentialChain(chains=[quiz_chain, review_chain], input_variables=["text", "number", "subject", "tone", "response_json"], output_variables=["quiz", "review"], verbose=True)

@app.get("/api/generate")
def get_quiz_questions(TEXT, NUMBER, SUBJECT, TONE):

    response=generate_eval_chain(
        {
            "text": TEXT,
            "number": NUMBER,
            "subject":SUBJECT,
            "tone": TONE,
            "response_json": json.dumps(RESPONSE_JSON)
        }
    )

    quiz=response.get("quiz")

    # Get json block from the response which is in between ```json and ``` 
    quiz = quiz.replace("### RESPONSE_JSON","")
    json_block = json.loads(quiz)

    print(json_block)

    return json_block

# quiz_table_data = []
# for key, value in json_block.items():
#     mcq = value["mcq"]
#     options = " | ".join(
#         [
#             f"{option}: {option_value}"
#             for option, option_value in value["options"].items()
#             ]
#         )
#     correct = value["correct"]
#     quiz_table_data.append({"MCQ": mcq, "Choices": options, "Correct": correct})

# quiz=pd.DataFrame(quiz_table_data)

# quiz.to_csv("gen_ai.csv",index=False)