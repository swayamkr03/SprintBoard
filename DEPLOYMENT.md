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
VITE_API_BASE_URL=https://your-api-host.example.com
```

## Frontend Build

```bash
cd frontend
npm install
npm run build
```

Deploy `frontend/dist` to a static hosting provider such as Vercel, Netlify, Render Static Site, or GitHub Pages.

## Backend Build

```bash
cd backend
dotnet restore
dotnet publish -c Release
```

Deploy the ASP.NET Core API to a provider that supports .NET hosting, such as Azure App Service, Render Web Service, Railway, or a VPS.

## Production Database Note

The current project uses SQLite for simple local development. For a stable hosted production deployment, use a persistent disk or move to a hosted database such as PostgreSQL or SQL Server.
