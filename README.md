# Full Stack App (Docker Compose)

This project contains a frontend and backend that can be started together with Docker Compose.

## Prerequisites

- Docker
- Docker Compose (v2)

## Run with Docker Compose

From the project root:

1. Build and start the stack:
   
   ```bash
   docker compose up --build
   ```

2. Open the app in your browser:

   - Frontend: http://localhost:5173

3. Stop the stack:

   ```bash
   docker compose down
   ```

## Notes

- The frontend is in the `frontend/` folder and is served via Vite.
- The backend is in the `backend/` folder and runs a Node/TypeScript server.
- If you change dependencies or Dockerfiles, re-run with `--build`.
