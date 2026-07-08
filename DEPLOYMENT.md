# Deployment Notes

SprintBoard has two deployable parts:

- `backend`: ASP.NET Core Web API
- `frontend`: React + Vite static app

## Frontend Environment Variable

The frontend reads the backend URL from:

```text
VITE_API_BASE_URL
```

For local development:

```text
VITE_API_BASE_URL=http://localhost:5063
```

For production, set it to the deployed API URL, for example:

```text
VITE_API_BASE_URL=https://sprintboard-api-swayamkr03.onrender.com
```

## Frontend Build

```bash
cd frontend
npm install
npm run build
```

Deploy `frontend/dist` to a static hosting provider such as Render Static Site, Vercel, Netlify, or GitHub Pages.

## Backend Build

```bash
cd backend
dotnet restore
dotnet publish -c Release
```

Deploy the ASP.NET Core API to a provider that supports Docker or .NET hosting, such as Render Web Service, Azure App Service, Railway, or a VPS.

## Render Blueprint Deployment

This repository includes:

```text
render.yaml
backend/Dockerfile
```

Use Render Blueprints:

```text
https://dashboard.render.com/blueprint/new?repo=https://github.com/swayamkr03/SprintBoard
```

The Blueprint creates:

- `sprintboard-api-swayamkr03`
- `sprintboard-web-swayamkr03`

The frontend is configured with:

```text
VITE_API_BASE_URL=https://sprintboard-api-swayamkr03.onrender.com
```

Current live backend:

```text
https://sprintboard-api-swayamkr03.onrender.com
```

Current live frontend:

```text
https://sprintboard-web-swayamkr03.onrender.com
```

If Render changes the API service URL because the name is unavailable, update the frontend service environment variable to match the actual API URL and redeploy the frontend.

## Production Database Note

The current project uses SQLite. On Render, `render.yaml` attaches a persistent disk at `/var/data` and sets:

```text
ConnectionStrings__DefaultConnection=Data Source=/var/data/sprintboard.db
```

For a larger production app, move to a hosted database such as PostgreSQL or SQL Server.
