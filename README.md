# CourseMind

CourseMind is a tool designed to assist professors in creating course materials, including questions, small projects, and detailed course outlines. This project integrates authentication, course management, quizzes, assignments, and AI-driven question generation based on provided course content.

## Features
- User authentication
- Course and quiz management
- Assignment creation and management
- AI model for automatic question and assignment generation from uploaded materials

## Technologies
- **Frontend:** Next.js
- **Backend:** Express.js, MongoDB
- **AI Model:** LLMs, with a focus on **Qwen** for generation tasks (such as question and assignment generation)

## Project Structure
- **Frontend (Next.js):** Handles user interaction and course management dashboard.
- **Backend (Express.js):** Supports authentication, CRUD operations for courses, quizzes, and assignments.
- **AI Model (LLMs - Qwen):** Automates the generation of questions and assignments from course materials.

## Setup Instructions

### 1. Clone the repository
```bash
git clone https://github.com/username/CourseMind.git
cd CourseMind
```

### Will be updated soon

## Tasks

### Authentication
- [X] **Authentication - UI**
- [X] **Authentication - backend API**
- [X] **Integration of Authentication UI & API**

### Database & Backend
- [X] **Create database schema - backend (structuring)**
- [ ] **CRUD for courses - backend API**
- [ ] **CRUD for quizzes - backend API**
- [ ] **CRUD for assignments - backend API**
- [ ] **CRUD for materials for courses - backend API**

### UI (Frontend)
- [X] **Dashboard with list of courses - UI**
- [X] **Inner page for list of assignments and quizzes for each course - UI**
- [ ] **Create a new course - UI**
- [ ] **Create new quizzes - UI**
- [ ] **Create new assignment - UI**
- [ ] **Add new materials for course - UI**

### Integration Tasks
- [ ] **Integration of Courses CRUD UI & API**
- [ ] **Integration of Quizzes CRUD UI & API**
- [ ] **Integration of Assignments CRUD UI & API**

### AI Model
- [X] **Get a model to create questions from given context - AI Model (POC)**
- [ ] **Create data chunks from the uploaded data materials - AI Model**
- [ ] **Use data chunks to find key information in chunks for question generation - AI Model**
- [ ] **Convert document to data chunks - AI Model**
- [ ] **Get a model to generate assignments or short project problems for courses - AI Model**
- [ ] **Integration of AI Model to feed new materials**
- [ ] **Integration of AI Model to generate new things**