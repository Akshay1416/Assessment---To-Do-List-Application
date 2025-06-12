# Todo List Application

A MEAN Stack (MongoDB, Express.js, Angular, Node.js) Todo List application with a modern UI using Salesforce Lightning Design System.

## Features

- Create, read, update, and delete tasks
- Mark tasks as complete/incomplete
- Responsive design for desktop and mobile
- Modern UI using Salesforce Lightning Design System

## Prerequisites

- Node.js (v14 or higher)
- MongoDB (v4.4 or higher)
- Angular CLI (v15 or higher)

## Setup

1. Clone the repository:

```bash
git clone <repository-url>
cd todo-list
```

2. Install backend dependencies:

```bash
npm install
```

3. Install frontend dependencies:

```bash
cd client
npm install
```

4. Create a `.env` file in the root directory with the following content:

```
PORT=3000
MONGODB_URI=mongodb://localhost:27017/todo-list
```

## Running the Application

1. Start MongoDB:

```bash
mongod
```

2. Start the backend server (from the root directory):

```bash
npm run dev
```

3. Start the frontend development server (from the client directory):

```bash
cd client
ng serve
```

4. Open your browser and navigate to `http://localhost:4200`

## Testing

1. Backend tests:

```bash
npm test
```

2. Frontend tests:

```bash
cd client
ng test
```

## API Endpoints

- GET /api/tasks - Retrieve all tasks
- POST /api/task - Create a new task
- PUT /api/task/:id - Update a task
- DELETE /api/task/:id - Delete a task

## Technologies Used

- Backend:

  - Node.js
  - Express.js
  - MongoDB
  - Mongoose
  - Mocha (testing)

- Frontend:
  - Angular
  - TypeScript
  - Salesforce Lightning Design System
  - RxJS

## Project Structure

```
todo-list/
├── client/                 # Angular frontend
│   ├── src/
│   │   ├── app/
│   │   │   ├── components/
│   │   │   ├── services/
│   │   │   └── ...
│   │   └── ...
│   └── ...
├── models/                 # MongoDB models
├── routes/                 # API routes
├── tests/                  # Backend tests
├── .env                    # Environment variables
├── package.json
└── server.js              # Express server
```
