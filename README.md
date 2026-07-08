# SprintBoard

SprintBoard is a full-stack issue tracking application built with React and ASP.NET Core Web API. It helps teams create projects, assign issues, track status and priority, and discuss work through comments.

## Features

- Dashboard summary for projects, issues, users, comments, and issue status counts
- Project create, edit, delete, and list workflows
- User create, edit, delete, and list workflows
- Issue create, edit, status update, priority update, assignment, delete, and list workflows
- Comments on issues with author selection and delete support
- Search and filters by project, status, priority, and assignee
- Backend DTOs and validation for safer API input
- SQLite persistence through Entity Framework Core
- Clean component-based React UI

## Tech Stack

- Frontend: React, Vite, JavaScript, CSS
- Backend: ASP.NET Core Web API
- Database: SQLite
- ORM: Entity Framework Core
- API Docs: OpenAPI / Scalar when available

## Project Structure

```text
SprintBoard/
  backend/    ASP.NET Core Web API
  frontend/   React + Vite app
```

## Backend Setup

```bash
cd backend
dotnet restore
dotnet ef database update
dotnet run
```

The backend will print a URL like:

```text
http://localhost:5063
```

Use that URL as `API_BASE_URL` in `frontend/src/App.jsx`.

## Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

## Main API Endpoints

```text
GET    /api/dashboard/summary

GET    /api/projects
POST   /api/projects
GET    /api/projects/{id}
PUT    /api/projects/{id}
DELETE /api/projects/{id}

GET    /api/users
POST   /api/users
GET    /api/users/{id}
PUT    /api/users/{id}
DELETE /api/users/{id}

GET    /api/projects/{projectId}/issues
POST   /api/projects/{projectId}/issues
GET    /api/issues/{id}
PUT    /api/issues/{id}
DELETE /api/issues/{id}

GET    /api/issues/{issueId}/comments
POST   /api/issues/{issueId}/comments
DELETE /api/comments/{id}
```

## Current Status

V2 is implemented:

- CRUD coverage for projects, users, issues, and comments
- Issue filtering and search
- Backend DTO validation
- Portfolio-friendly UI styling

## Future Improvements

- JWT authentication and role-based access
- Drag-and-drop Kanban board
- Pagination for larger issue lists
- Activity log for issue changes
- Deployment with a hosted database
